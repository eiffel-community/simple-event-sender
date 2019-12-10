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

test("Testid: 7 for FR20", async () => {
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
      id: "09adcdd6-772b-492c-b7e0-32e975da5533",
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
      id: "e2ba31b1-cf9f-4056-b456-726822de7c0c"
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
      query: { "meta.id": "09adcdd6-772b-492c-b7e0-32e975da5533" }
    }
  ];
  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, lookupObj, parameterObj },
      config
    )
      .then(function(response) {
        expect(response.data.event.links.length).toBe(2);
      })
      .catch(function(error) {
        console.log(error);
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});

test("Testid: 8 for FR20", async () => {
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
      id: "13d9e273-5fb6-45bf-98c6-5a33e3ea4aef",
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

  eiffelDataObj.meta.id = "e3d29b0a-4621-4e75-aabf-45b58330b990";

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
      id: "1408623c-6969-489d-a598-1906c414d2c9"
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
      query: {
        "meta.type": "EiffelArtifactCreatedEvent"
      }
    }
  ];

  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, lookupObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.data.event.links.length > 2).toBe(true);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
});

test("Testid: 9 for FR20", async () => {
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
      type: "EiffelSourceChangeSubmittedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "0760fa1d-272d-4403-955d-fc497ed827ff"
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
    links: []
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

  eiffelDataObj.meta.id = "2f984e1b-9929-41e0-af3f-13a522de0e8d";

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
      type: "EiffelSourceChangeCreatedEvent",
      version: "4.0.0",
      time: 1234567890,
      id: "c3fd3e33-63d1-4123-a8d7-e418d5e44277"
    },
    data: {
      gitIdentifier: {
        commitId: "fd090b60a4aedc5161da9c035a49b14a319829b4",
        branch: "myBranch",
        repoName: "myPrivateRepo",
        repoUri: "https://github.com/johndoe/myPrivateRepo.git"
      },
      author: {
        name: "John Doe",
        email: "john.doe@company.com",
        id: "johndoe",
        group: "Team Gophers"
      },
      change: {
        files:
          "https://company.com/changes/fd090b60a4aedc5161da9c035a49b14a319829b4",
        insertions: 173,
        deletions: 79,
        tracker: "GitHub",
        details:
          "https://github.com/johndoe/myPrivateRepo/commit/fd090b60a4aedc5161da9c035a49b14a319829b4",
        id: "42"
      }
    },
    links: []
  };
  lookupObj.links = [
    {
      linkType: "BASE",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: {
        "meta.type": "EiffelSourceChangeSubmittedEvent"
      }
    }
  ];
  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, lookupObj, parameterObj },
      config
    )
      .then(function(response) {
        expect(response.data.event.links.length > 1).toBe(false);
      })
      .catch(function(error) {
        expect(error.response.status).toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});

test("Testid: 10 for FR20", async () => {
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
      type: "EiffelSourceChangeSubmittedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "e30f8005-308f-41cf-a4ab-650162845dfe"
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
    links: []
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
      id: "5dbffacd-ad17-401c-8526-033a8b9f4125"
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
    links: []
  };

  let lookupObj = lookUp.instantiate();

  lookupObj.links = [
    {
      linkType: "CHANGE",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: { "meta.id": "e30f8005-308f-41cf-a4ab-650162845dfe" }
    }
  ];

  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      {
        eiffelDataObj,
        parameterObj,
        lookupObj
      },
      config
    )
      .then(function(response) {
        expect(response.status).toBe(200);
        expect(response.data.event.links.length).toBe(1);
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };

  await setTimeout(postEvent, 1000);
});
