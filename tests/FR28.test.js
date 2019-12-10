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

// In this file: Event and tests used to validate FR28 is made
// SCS can look up links to SCC

// This test file was created by David Björelind //

const Axios = require("axios");

const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

const lookupObj = {
  links: [
    {
      linkType: "CHANGE",
      allowSeveralMatches: true,
      allowMissingMatch: false,
      query: {
        "meta.id": "dd20b814-cfb8-45be-af54-7f7715badaf3"
      }
    }
  ]
};

test("Test id:27 for FR28", async () => {
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

  // Creating dummy SCC event
  let eiffelDataObj = {
    meta: {
      type: "EiffelSourceChangeCreatedEvent",
      version: "4.0.0",
      time: 1234567890,
      id: "dd20b814-cfb8-45be-af54-7f7715badaf3"
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

  //  SCS Event
  eiffelDataObj = {
    meta: {
      type: "EiffelSourceChangeSubmittedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "ea93dc40-ed7b-4a43-80c9-a0b6d5207a84"
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

  // Posting the test event
  let postEvent = async _ => {
    await Axios.post(
      "http://localhost:9000/submitevent",
      { eiffelDataObj, parameterObj, lookupObj },
      config
    )
      .then(function(response) {
        expect(response.data.event.links[1].target).toBe(
          "dd20b814-cfb8-45be-af54-7f7715badaf3"
        );
      })
      .catch(function(error) {
        expect(error.response.status).not.toBe(403);
      });
  };
  await setTimeout(postEvent, 500);
});
