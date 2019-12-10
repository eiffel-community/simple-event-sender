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

/* UUIDs used for tests in this file
27f7e146-a4dd-45e1-b961-48b6a932ca4e
b671ec60-987c-4063-9339-ce0ba80072a9
496c7564-1376-4c3f-b482-5b514b219d4a
4dd15cec-abd7-4ea4-a2c7-e5d229dbe7f4 */

/*
FR21: The AllowMissingMatch parameter controls if a missing match during look up should be accepted or not.
It has default false. If the missing match is not accepted an Error message will be created. It is link specific.*/

const CLM = require("./eventgenerators/CD");
const ArtC = require("./eventgenerators/ArtC");
const lookUp = require("./eventgenerators/LookUp");
const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

test("Testid: 11 for FR21", async () => {
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
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "27f7e146-a4dd-45e1-b961-48b6a932ca4e"
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
  let lookupObj = lookUp.instantiate();

  lookupObj.links = [
    {
      linkType: "SUBJECT",
      allowMissingMatch: false,
      query: { "data.meta.id": "c72aa222-d183-4634-b540-22bf6cb80bfa" }
    }
  ];
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, lookupObj, parameterObj },
    config
  )
    .then(function(response) {
      //TODO: EXPECT error message

      expect(response.status).not.toBe(200);
    })
    .catch(function(error) {
      expect(error.response.data["Error Message"]).toBe(
        "No matches found and allowMissingMatch false for linkType: SUBJECT"
      );
      expect(error.response.status).toBe(403);
    });
});

//Test if a missing match for a link in a look up is accepted
test("Testid: 12 for FR21", async () => {
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
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "426c7564-1376-4c3f-b482-5b514b219d4a"
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
        target: "aaaaaaaa-b34b-5ccc-8ddd-eee23eeeeee1"
      },
      {
        type: "SUBJECT",
        target: "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee4"
      }
    ]
  };
  let lookupObj = lookUp.instantiate();

  lookupObj.links = [
    {
      linkType: "CONTEXT",
      allowMissingMatch: true,
      query: { "event.id": "1250812587125" }
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

test("Testid: 13 for FR21", async () => {
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
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "83aae3af-8294-47db-90cc-aa3ad4734157"
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
        target: "aaaaaaaa-b34b-5ccc-8ddd-eee23eeeeee1"
      }
    ]
  };
  let lookupObj = lookUp.instantiate();

  lookupObj.links = [
    {
      linkType: "SUBJECT",
      allowMissingMatch: true,
      query: { "event.id": "1250812587125" }
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
        "Links missing: SUBJECT"
      );
      expect(error.response.status).toBe(403);
    });
});

test("Testid: 14 for FR21", async () => {
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
      type: "EiffelConfidenceLevelModifiedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "83aae3af-8aa4-47db-90cc-aa3ad4734157"
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
        target: "aaaaaaaa-b34b-5ccc-8ddd-eee23eeeeee1"
      }
    ]
  };
  let lookupObj = lookUp.instantiate();

  lookupObj.links = [
    {
      linkType: "SUB_CONFIDENCE_LEVEL",
      allowMissingMatch: false,
      query: { "meta.id": "c72aae8f-aaaa-4634-b540-22bf6cb80bfa" }
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
        "No matches found and allowMissingMatch false for linkType: SUB_CONFIDENCE_LEVEL"
      );
      expect(error.response.status).toBe(403);
    });
});
