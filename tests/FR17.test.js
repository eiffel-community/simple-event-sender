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

// This test file was created by Tomas Gudmundsson//

const Axios = require("axios");

const lookUp = require("./eventgenerators/LookUp");

/*  "Description: The product shall output the JSON file 
over AMQP sent onto RabbitMQ after validation."
    
    FR17 is "after validation", thus posts with correct input 
until validation(including validation)"*/

//the client has inputted SendToMessageBus = true
//only test the function SendToMessageBus which is after all validation functions.
test("Test 1, test_id: 47 for FR17, ", async () => {
  let parameterObj = {
    sendToMessageBus: true,
    edition: "agen-1"
  };

  let auth_token = "";
  await Axios.post("http://localhost:9000/login", {
    name: "Albin",
    password: "password123"
  })
    .then(function(response) {
      auth_token = response.headers["auth-token"];
      expect(response.status).toBe(200);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
  let config = {
    headers: { "auth-token": auth_token }
  };
  //Posts an empty ArtC event with a set id
  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "39944e68-32ea-4939-a5c7-a6e69d52a1ad",
      source: {
        serializer: "pkg:maven/com.mycompany.tools/eiffel-serializer@1.0.3"
      },
      tags: ["fast-track", "customer-a"]
    },
    data: {
      identity: "pkg:maven/com.mycompany.myproduct/artifact-name@2.1.7",
      fileInformation: [
        {
          name: "debug/launch",
          tags: ["debug", "launcher"]
        },
        {
          name: "test/log.txt"
        },
        {
          name: "bin/launch",
          tags: ["launcher"]
        }
      ],
      buildCommand: "/my/build/command with arguments",
      name: "Full verbose artifact name"
    },
    links: [
      {
        type: "CAUSE",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee1"
      },
      {
        type: "PREVIOUS_VERSION",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee2"
      },
      {
        type: "COMPOSITION",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee1"
      },
      {
        type: "ENVIRONMENT",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee3"
      }
    ]
  };

  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.status).toBe(200);
    })
    .catch(function(error) {
      expect(error.response.data["Error Message"]).toBe(
        "Message was not able to be sent to message bus"
      );
      expect(error.response.status).not.toBe(403);
    });
});

//the client has inputted SendToMessageBus = false
//eventDb.saveEvent is within the function sendToMessageBus of rabbitMQConsumer.js
//if the the function sendToMessageBus is not invoked, then eventDb.saveEvent will not be invoked
//thus by looking-up if the event be found in Event Database,
//indirectly test the first situations of the second requirement of FR17
test("Test 2, test_id: 47 for FR17, ", async () => {
  let parameterObj = {
    sendToMessageBus: false,
    edition: "agen-1"
  };

  let auth_token = "";

  await Axios.post("http://localhost:9000/login", {
    name: "Albin",
    password: "password123"
  })
    .then(function(response) {
      auth_token = response.headers["auth-token"];
      expect(response.status).toBe(200);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
  let config = {
    headers: { "auth-token": auth_token }
  };

  //Posts an empty ArtC event with a set id
  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "6a8c470f-f318-40eb-a651-9cbd5e2a1d8c",
      source: {
        serializer: "pkg:maven/com.mycompany.tools/eiffel-serializer@1.0.3"
      },
      tags: ["fast-track", "customer-a"]
    },
    data: {
      identity: "pkg:maven/com.mycompany.myproduct/artifact-name@2.1.7",
      fileInformation: [
        {
          name: "debug/launch",
          tags: ["debug", "launcher"]
        },
        {
          name: "test/log.txt"
        },
        {
          name: "bin/launch",
          tags: ["launcher"]
        }
      ],
      buildCommand: "/my/build/command with arguments",
      name: "Full verbose artifact name"
    },
    links: [
      {
        type: "CAUSE",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee1"
      },
      {
        type: "PREVIOUS_VERSION",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee2"
      },
      {
        type: "COMPOSITION",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee1"
      },
      {
        type: "ENVIRONMENT",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee3"
      }
    ]
  };

  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.status).toBe(200);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });

  let lookupObj = lookUp.instantiate();

  eiffelDataObj = {
    meta: {
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "d2c94e97-0906-4e15-923c-b7ea5609189e"
    },
    data: {
      name: "stable",
      value: "SUCCESS",
      issuer: {
        name: "Gary Johnston",
        email: "gary.johnston@teamamerica.com",
        id: "garyj",
        group: "Team America"
      }
    },
    links: [
      {
        type: "CAUSE",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eee23eeeeee1"
      }
    ]
  };

  lookupObj.links = [
    {
      linkType: "SUBJECT",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: { "meta.id": "6a8c470f-f318-40eb-a651-9cbd5e2a1d8c" }
    }
  ];

  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, lookupObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.status).not.toBe(200);
    })
    .catch(function(error) {
      expect(error.response.data["Error Message"]).toBe(
        "No matches found and allowMissingMatch false for linkType: SUBJECT"
      );
      //      expect(error.response.data["Error Type"]).toBe("LINK_MATCH_NOT_FOUND");
      expect(error.response.status).toBe(403);
    });
});
