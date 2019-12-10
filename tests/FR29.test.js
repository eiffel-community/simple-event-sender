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

// In this file: Event and tests used to validate FR29 is made
// CD will use look up to link to ArtC events and to SCS events.

// This test file was created by David Björelind //

const Axios = require("axios");

const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

const lookupObj = {
  links: [
    {
      linkType: "ELEMENT",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: {
        "meta.id": "4aa508d7-39b5-49ec-8e24-0a7933efa15d"
      }
    },
    {
      linkType: "ELEMENT",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: {
        "meta.id": "e3b8471c-8968-4d03-8f39-f0f49dafcb9f"
      }
    }
  ]
};

test("Test id:28 for FR29", async () => {
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

  // Creating dummy SCS event
  let eiffelDataObj = {
    meta: {
      type: "EiffelSourceChangeSubmittedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "4aa508d7-39b5-49ec-8e24-0a7933efa15d"
    },
    data: {
      svnIdentifier: {
        revision: 42,
        directory: "trunk",
        repoName: "Mainline",
        repoUri: "svn://repohost/mainline"
      },
      submitter: {
        name: "Jane Doe",
        email: "jane.doe@company.com",
        id: "j_doe",
        group: "Team Wombats"
      }
    },
    links: [
      {
        type: "CAUSE",
        target: "1d967e40-5e71-4c0b-9523-8bf6eb60fa66"
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

  // Dummy ArtC Event (Second dummy event)
  eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "e3b8471c-8968-4d03-8f39-f0f49dafcb9f",
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
        target: "1d967e40-5e71-4c0b-9523-8bf6eb60fa66"
      }
    ]
  };

  // Posting the second dummy event
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

  //  CD Event
  eiffelDataObj = {
    meta: {
      type: "EiffelCompositionDefinedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "d3d271d6-2e33-4d99-8c26-5a39654573be"
    },
    data: {
      name: "myCompositionName",
      version: "42.0.7"
    },
    links: [
      {
        type: "CAUSE",
        target: "1d967e40-5e71-4c0b-9523-8bf6eb60fa66"
      }
    ]
  };

  // Posting the test event
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj, lookupObj },
    config
  )
    .then(function(response) {
      expect(response.data.event.links[1].target).toBe(
        "4aa508d7-39b5-49ec-8e24-0a7933efa15d"
      );

      expect(response.data.event.links[2].target).toBe(
        "e3b8471c-8968-4d03-8f39-f0f49dafcb9f"
      );
    })
    .catch(function(error) {
      expect(error.response).not.toBe(403);
    });
});
