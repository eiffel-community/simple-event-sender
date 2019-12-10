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
const Axios = require("axios");
/*UUID events used in this test:
c7229e8f-d183-4634-b540-22bf6cb80bfa
22dc6b2b-a0e2-4f85-a526-f28f3a777c42
e2ba31b1-cf9f-4056-b456-726822de7c0c
6a8c470f-f318-40eb-a651-9cbd5e2a1d8c
231a796c-3a3a-4617-9d5b-32acce28cc7d
eef1e77a-ec32-431d-bcfd-39b53c85c1a9
*/
const lookUp = require("./eventgenerators/LookUp");
const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};
/*Logins for auth-token, posts a ArtC-event and then tries to link
a CD-event to it and then checks length of links to be equal 1 */
//Only when the "sendToMessageBus" equals true and response.status equals 200,
//the first requirement of FR7 is fulfuilled
test("Test 1 for FR7: sending event to massage bus", async () => {
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
      id: "1a6c423d-887d-4327-ba4f-6452e870e7fa",
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
});
//indirectly test the second requirement of FR7
//only when the function sendToMessageBus be invoked, the eventDb.saveEvent be invoked
//which is to say the meta.id can be found by lookupObj
test("Test 2 for FR7: massage bus consumes message which is storing the event(meta.id) in event database", async () => {
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
      id: "bf557e62-16e9-45c0-a4f8-2ada9d2ea2f7",
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
      query: { "meta.id": "bf557e62-16e9-45c0-a4f8-2ada9d2ea2f7" }
    }
  ];
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, lookupObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.status).toBe(200);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
});
