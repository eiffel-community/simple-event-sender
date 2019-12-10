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

const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

test("Testid: 21 for FR24", async () => {
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

  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "e42f99cf-c455-4621-a07b-c285d3574e91",
      source: {
        serializer: "pkg:maven/com.mycompany.tools/eiffel-serializer@1.0.3"
      },
      id: "e42f99cf-c455-4621-a07b-c285d3574e91",
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

  eiffelDataObj = {
    meta: {
      type: "EiffelSourceChangeSubmittedEvent",

      version: "3.0.0",
      time: 1234567890,
      id: "5c01a8b0-f14d-4786-aee6-daa6910af295"
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
        target: "e42f99cf-c455-4621-a07b-c285d3574e91"
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
      expect(response.data.event.meta.type).toBe(
        "EiffelSourceChangeSubmittedEvent"
      );
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
});

test("Testid: 22 for FR24", async () => {
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

  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "0d8c0010-8599-4697-8f7e-70f8624b262c",
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

  eiffelDataObj = {
    meta: {
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "3853c5dd-0d97-465c-90aa-851163461781"
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
        type: "SUBJECT",
        target: "0d8c0010-8599-4697-8f7e-70f8624b262c"
      }
    ]
  };
  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, parameterObj },
      config
    )
      .then(function(response) {
        expect(response.status).toBe(200);
        expect(response.data.event.meta.type).toBe(
          "EiffelConfidenceLevelModifiedEvent"
        );
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});

test("Testid: 23 for FR24", async () => {
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

  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "92a381c5-eecf-406f-bb34-644baa03cafb",
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

  eiffelDataObj = {
    meta: {
      type: "EiffelCompositionDefinedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "e1a50e06-e8dd-4d5e-89ce-33c81b8e05b7"
    },
    data: {
      name: "myCompositionName",
      version: "42.0.7"
    },
    links: [
      {
        type: "ELEMENT",
        target: "92a381c5-eecf-406f-bb34-644baa03cafb"
      }
    ]
  };

  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, parameterObj },
      config
    )
      .then(function(response) {
        expect(response.status).toBe(200);
        expect(response.data.event.meta.type).toBe(
          "EiffelCompositionDefinedEvent"
        );
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});
