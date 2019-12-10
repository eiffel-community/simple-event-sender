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

// In this file: Event and tests used to validate FR27 is made
// CLM can look up links to ArtC

// This test file was created by David Björelind //

const Axios = require("axios");

const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

const lookupObj = {
  links: [
    {
      linkType: "SUBJECT",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: {
        "meta.id": "dfde5c04-792f-4b3f-93ef-716f13b30aba"
      }
    }
  ]
};

test("Test id:26 for FR27", async () => {
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

  // Creating dummy ArtC event
  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "dfde5c04-792f-4b3f-93ef-716f13b30aba",
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

  // Posting the dummy event
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

  // CLM Event
  eiffelDataObj = {
    meta: {
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "2b79f3ac-967e-455b-8832-492367e3c9ef"
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
        target: "f1adece3-95ae-4e1b-b96a-71dcdea92eb4"
      }
    ]
  };

  // Posting the test event
  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, parameterObj, lookupObj },
      config
    )
      .then(function(response) {
        expect(response.data.event.links[1].target).toBe(
          "dfde5c04-792f-4b3f-93ef-716f13b30aba"
        );
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 500);
});
