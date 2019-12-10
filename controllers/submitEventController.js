/*Copyright 2019 Evsent

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/
const exception = require('../modules/eventSenderException');
const messageModule = require('../modules/messageModule');
const objBuilder = require('../Tools/objBuilder');
const highLevelValidationValidator = require('../Tools/highLevelValidation');
const generator = require('../Tools/dataGenerator.js')

const JWToken = require('jsonwebtoken');
const validator = require('../Tools/validation');
const rabbitMQpublisher = require('../modules/rabbitMQPublisher');
const linkFetcher = require('../Tools/dataFetcher');



exports.get = function(req, res) {
  res.send("Submit Event Endpoint")
};

/**
* Recive Eiffel event data from the client.
*/
exports.post = async function(req, res) {
  console.log("POST REQUEST recived on /submitevent");
  try {
  await verifyToken(req, res);
  await highLevelValidationValidator.validateHighLevelObj(res,req.body);

  // The input object (body) containing eiffelDataObj, lookupObj, parameterObj is splitted up to its constituents
  let eiffelDataObj = req.body.eiffelDataObj; //Object containting all Eiffel data.
  let lookupObj = req.body.lookupObj; //Object containing information used for looking up Links
  let parameterObj = req.body.parameterObj; //Object containing optionalparameters

  var completeInformation = true; //Boolean that
  // Change if the validation concludes that the robot/user have not provided enoug information
  // Creates default parameterObj if input is undefined of incompleate. It also validates it if it is complete.
  parameterObjValidated = await objBuilder.validateParameterObj(parameterObj);
  edition = parameterObjValidated.edition

  // Calles the first validation-function of the actual eiffel object
  await validator.initialValidate(eiffelDataObj,edition);
  await generator.existInDB(eiffelDataObj); 
  await validator.linkCheckDB(eiffelDataObj,edition);

  // This if-statement defines what happens if the lookupObj exists
  if (!(lookupObj == undefined || lookupObj == {})) {

   //fetchLinks
    linkArr = lookupObj.links

    for(i in linkArr){
      //Search for link in entry in lookupObj
      foundLinks = await linkFetcher.findLinkIDs(eiffelDataObj,linkArr[i].query,linkArr[i].linkType,linkArr[i].allowSeveralMatches,linkArr[i].allowMissingMatch)

      if(foundLinks != null) {
        foundLinks.forEach(link=>{
          //Add all foundlinks to event
          if (!((eiffelDataObj.links).includes({"target" : link.target, "type" : link.type}))){
            eiffelDataObj.links.push({"type" : link.type, "target" : link.target})
          }
        })
      }
    }
}
  // Calling linkCheck that validates that all the required links are met
  await validator.linkCheck(eiffelDataObj,edition)

  // Setting the UUID and current time of eiffel object creation
  generator.setIDandTime(eiffelDataObj)

  // Callin generateVersionFromEditon that generates the version number in the eiffel object depencent on the edition (in text form) given in the parameter object
  generator.generateVersionFromEditon(eiffelDataObj,edition)

  //Last validation of completed schema before sending to rabbitMQ
  await validator.validate(eiffelDataObj,edition)

  //This if-statent sends the complete event to RabbitMQ sends
      if (parameterObjValidated.sendToMessageBus) {
        rabbitMQpublisher.sendToMessageBus(JSON.stringify(eiffelDataObj), (messageSent, err)=>{
          if(messageSent) {
            messageModule.sendCreateEventSuccessResponse(res, eiffelDataObj);
          }
          else{
            let rabbitMQexception = new exception.rabbitMQException(err);
            messageModule.sendFailResponse(res, rabbitMQexception)
          }
        });
      }else {
        messageModule.sendCreateEventSuccessResponse(res, eiffelDataObj);
      }


} catch (e) {
    // If an exception is thrown it is stored in `e` and the messageModule is called to send a response to the client with
    // information about where and when the verification fails
    messageModule.sendFailResponse(res,e);
}
}


/**
* Authorize that user have a valid access token
*/
verifyToken = function (req, res) {
  const accessToken = req.header('auth-token'); //Retreive token from request header

  return new Promise((resolve, reject) => {
  if(typeof accessToken !== 'undefined') { //Check if there exist any information in header token field
    JWToken.verify(accessToken, process.env.SECRET_TOKEN, (err, data) => { //Verify the token
      if(err) {
        reject(new exception.authorizationException("Illegal token", exception.errorType.BAD_TOKEN));
      } else {
        resolve();
      }
    });
  } else {
    reject(new exception.authorizationException("Missing token", exception.errorType.BAD_TOKEN));
  }
})
}
