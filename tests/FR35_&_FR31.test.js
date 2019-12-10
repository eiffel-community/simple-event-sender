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

// This test file was created by David Björelind //

// In this file: Event and tests used to validate FR35 is made, combined with FR31
// FR35: Test the edition string

const Axios = require("axios");

const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

const SCS_model = require("./eventgenerators/SCS"); //3.0.0
const CD_model = require("./eventgenerators/SCS"); //3.0.0
const SCC_model = require("./eventgenerators/SCC"); //4.0.0

test("Test id:5 for FR35 & Test id:29 for FR31", async () => {
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

  // Creating parameter object
  let parameterObj = {
    sendToMessageBus: true,
    edition: "agen-1"
  };

  // Creating SCS event
  let eiffelDataObj = {
    meta: {
      type: "EiffelSourceChangeSubmittedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "aa587e6f-4925-4720-abf5-a730bbe3774b"
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

  // Posting test event1
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.data.event.meta.version).toBe("3.0.0");
    })
    .catch(function(error) {
      console.log(error);
      expect(error.response.status).not.toBe(403);
    });

  // Creating false SCC event
  eiffelDataObj = {
    meta: {
      type: "EiffelSourceChangeCreatedEvent",
      version: "4.0.0",
      time: 1234567890,
      id: "6840c359-d605-40bd-ad4a-40e8976c7749"
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
    links: [
      {
        type: "CAUSE",
        target: "1d967e40-5e71-4c0b-9523-8bf6eb60fa66"
      }
    ]
  };

  // Posting the second test event
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.data.event.meta.version).toBe("4.0.0");
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
});

test("Test id:6 for FR35", async () => {
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

  // Creating FALSE parameter object
  let parameterObj = {
    sendToMessageBus: true,
    edition: "agen-1111"
  };

  //  Creating CD Event
  eiffelDataObj = {
    meta: {
      type: "EiffelCompositionDefinedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "77881528-cdb2-4927-836c-95a7c08aede2"
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
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      // Expected: Edition error!
      expect(response.event).not.toBe(200);
    })
    .catch(function(error) {
      expect(error.response.data["Error Type"]).toBe("UNSUPPORTED_EDITION");
    });
});
