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

dataFetcher = require("./dataFetcher")
validation = require("./validation")
lookSchema = require("./exampleLookUpObjects/lookUp1")
messageModule = require("../modules/messageModule")
schemaParser = require("../Tools/schemaParser")
const uuid = require('uuid');
var dbh = require("../modules/dbConnectionHandler")
ObjectID = require('mongodb').ObjectID
const exception = require('../modules/eventSenderException');


//Timestamp. Amount of milliseconds since 1 jan 1970 (according to format)
function createMetaTime() {
  return Date.now();
}

//When we push into the DB we need to give it a new unique ID.
//pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
function createUID () {
    return uuid.v4();
}

/**
 * DEPRICATED
 * @param {} dataObject
 * @param {*} lookupObject
 */
function lookUp(dataObject, lookupObject){
  if (!validation.validate(lookupObject,lookSchema.lookUpSchema)){
    return "Not valid schema for LookUpObject"
  }

    lookupObject.forEach(element => {
      try {
       dataFetcher.FindlinkIDs(dataObject, element.query, element.linkType, element.allowSeveralMatches, element.allowMissingMatch)
        addLink(dataObject, element.linkType, uuid)
        return true;
      } catch (e) {
        messageModule.SendFailResponse(res,e)
        console.log(e);
        return false;
      }

    })
  setIDandTime(dataObject)
  return event
}

function setIDandTime(event){
  if (event.meta.id == null) {
    event.meta.id=createUID()  //Don't forget to make sure that the MongoPK is the same as UUID
  }
  event.meta.time=createMetaTime()
}

function generateVersionFromEditon(event,edition){
  if(event.meta.version == null){
    event.meta.version = schemaParser.getSchemaVersion(schemaParser.matchDatatoSchema(event,edition));
  }
}


//Add a new link to the element
function addLink(event, linkType, uuid){
  event.links.push({
    "type" : linkType,
    "target" : uuid
  })
}

//Check if an event already exists in the db
function existInDB(event){
  return new Promise((resolve,reject)=>{ 
      dbh.getEventDBInstance((db, err) => {
      
          db.collection(event.meta.type).find({"_id" : event.meta.id}).toArray((err, foundLinks) => {
        if(foundLinks.length == 0){
        resolve()  
        } else { 
        return reject(new exception.databaseException("The UUID for this sent event is already in use in the DB", exception.errorType.DUPLICATE_UUID_ERROR));
        }
       })
  })
  })
}

module.exports = {lookUp, setIDandTime, existInDB, generateVersionFromEditon}
