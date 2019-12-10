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

const messageModule = require('../modules/messageModule');
const exception = require('../modules/eventSenderException');
var Ajv = require('ajv');
var ajv = new Ajv({ $data: true, allErrors: true, schemaId: 'auto' });

/* validateParameterObj validates that the parameterObj follows the parameterObjschema.
It also makes sure that if a parameterObj is not recieved from input (undefined)
it also makes the object complete if incomplete based on the defaultParameterObj
*/
module.exports.validateParameterObj = function (parameterObj){
  return new Promise((resolve, reject) => {

    //This is the standard schema for which the parameterObj shall follow
    const parameterObjSchema =
    {
      "title": "parameterObj",
      "type": "object",
      "properties": {
        "sendToMessageBus": {
          "type": "boolean",
        },
        "edition": {
          "type": "string",
        }

      },
      "required": [
        "edition"
      ],
      "additionalProperties": false
    }

    let defaultParameterObj = {
      "sendToMessageBus"      :  true,
      "edition"               : "agen-1"
    }, key;

    let resultParameterObj = defaultParameterObj;

    var valid = ajv.validate(parameterObjSchema, parameterObj);
    if (!valid) {
      console.log(ajv.errors);
      reject(new exception.eiffelException("Invalid parameter object", exception.errorType.INVALID_PARAMETER_OBJECT));
    }

    if(parameterObj.edition != "agen-1") {
      reject(new exception.eiffelException("Unsupported edition", exception.errorType.UNSUPPORTED_EDITION));
    } else {
      resultParameterObj.edition = parameterObj["edition"];
    }

    if (parameterObj.hasOwnProperty("sendToMessageBus")) {
      resultParameterObj.sendToMessageBus = parameterObj["sendToMessageBus"];
    }
    return resolve(resultParameterObj);
  });
}
