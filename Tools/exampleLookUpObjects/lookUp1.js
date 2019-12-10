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
var Ajv = require('ajv');
var ajv = new Ajv({ $data: true, allErrors: true, schemaId: 'auto' });

function validate(schema,data){
    var valid = ajv.validate(schema, data);
    if (!valid) console.log(ajv.errors);
    return valid
  }


example1 =  {
    links: [
        { linkType: "SUBJECT",
          allowSeveralMatches: true,
          allowMissingMatch: true,
          query: {
              "data.identity" :"gitID:250203"
          }
        },
        {
            linkType: "CAUSE",
            query: {
                "data.gitCommitID" : "1250812587125"
            }
        }

    ]
}


lookUpSchema =
{
    "title": "lookUpObject",
    "type": "object",
    "properties": {
        "links" : {
            "type" : "array",
            "items" : {
                "type" : "object",
                "properties" : {
                        "linkType" : {"type" : "string"},
                        "query" : {"type" : "object"}, //make BETTER :)
                        "allowMissingMatch" : {"type" : "boolean"},
                        "allowSeveralMatches" : {"type" : "boolean"},
                        "required" : ["linkType","query"],
                        "additionalProperties" : false
                }
            }

        },
        "required": ["links"]
    },
    "additionalProperties": false
  }

  parameterSchema =
  {
      "type": "object",
      "properties": {
      "sendToMessageBus": {
          "type": "boolean",
        },
        "edition": {
            "type": "string",
          },
        "additionalProperties": false
      }
  }

console.log(validate(example1,lookUpSchema))
