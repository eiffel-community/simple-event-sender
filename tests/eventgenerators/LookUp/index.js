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

module.exports = {
  instantiate: function() {
    var instantiator = require("json-schema-instantiator");

    var schema = {
      title: "lookUpObject",
      type: "object",
      properties: {
        links: {
          type: "array",
          items: {
            type: "object",
            properties: {
              linkType: { type: "string" },
              query: { type: "object" },
              allowMissingMatch: { type: "boolean" },
              allowSeveralMatches: { type: "boolean" },
              required: ["linkType", "query"],
              additionalProperties: false
            }
          }
        },
        required: ["links"]
      },
      additionalProperties: false
    };
    this.instance = instantiator.instantiate(schema, {
      requiredPropertiesOnly: false
    });

    return this.instance;
  }
};
