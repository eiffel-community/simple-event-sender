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

const lookUp = require("./eventgenerators/LookUp");
const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

test("Testid: 24 for FR36", async () => {
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
      id: "bbca18b4-8b90-450a-a40b-71aef619ecf0",
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
      id: "00f391b3-44c5-4f2e-829e-7f0b2a932dc6"
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
      query: { "meta.id": "bbca18b4-8b90-450a-a40b-71aef619ecf0" }
    }
  ];

  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, lookupObj, parameterObj },
      config
    )
      .then(function(response) {
        expect(response.data.event.links[1].target).toBe(
          "bbca18b4-8b90-450a-a40b-71aef619ecf0"
        );
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});

test("Testid: 25 for FR36", async () => {
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
      id: "3bd21eb7-2b57-47eb-8fb1-fb4781dc2c66",
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
      id: "d55eccc6-0f01-4e0a-b5fd-5047d4e5dfcd"
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
        target: "3bd21eb7-2b57-47eb-8fb1-fb4781dc2c66"
      },
      {
        type: "SUBJECT",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee3"
      }
    ]
  };

  lookupObj.links = [
    {
      linkType: "CAUSE",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: { "meta.id": "3bd21eb7-2b57-47eb-8fb1-fb4781dc2c66" }
    }
  ];

  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, lookupObj, parameterObj },
      config
    )
      .then(function(response) {
        expect(response.data.event.links[0].target).toBe(
          "3bd21eb7-2b57-47eb-8fb1-fb4781dc2c66"
        );
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});
