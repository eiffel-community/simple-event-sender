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
var Ajv = require('ajv');
var ajv = new Ajv({ $data: true, allErrors: true, schemaId: 'auto' });

function highLevelValidationSchema() {
  return {
    "type": "object",
    "title": "The Root Schema",
    "properties": {
      "eiffelDataObj": {
        "type": "object",
        "title": "The Eiffeldataobj Schema"
      },
      "lookupObj": {
        "$id": "#/properties/lookupObj",
        "type": "object",
        "title": "The Lookupobj Schema",
      },
      "parameterObj": {
        "$id": "#/properties/parameterObj",
        "type": "object",
        "title": "The Parameterobj Schema",
      }
    },
    "required": [
      "eiffelDataObj",
      "parameterObj"
    ],
    "additionalProperties": false
  };
}

/**
 * validateHighLevelObj validates that the input object follows the Simple Event Sender specific schema.
 * If the object does not match the schema an exception is thrown.
 * If the object passes the validation the function returns true.
 */
module.exports.validateHighLevelObj = function (res, data){
  return new Promise((resolve, reject) => {

    const inputObjSchema = highLevelValidationSchema();

    var valid = ajv.validate(inputObjSchema, data);
    if (!valid){
      reject(new exception.eiffelException("Input object was not properly formatted", exception.errorType.INVALID_PARAMETER_OBJECT));
    }
    return resolve(true);
  });
};
