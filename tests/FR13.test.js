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

var re = new RegExp(
  "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
);

const parameterObj = {
  sendToMessageBus: true,
  edition: "agen-1"
};

test("Test id: 17 for FR13", async () => {
  let auth_token = "";

  let eiffelDataObj = {
    meta: {
      type: "EiffelCompositionDefinedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "97e63077-05f7-4a74-aee9-bb3dbeaea805"
    },
    data: {
      name: "myCompositionName",
      version: "42.0.7"
    },
    links: []
  };

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
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      //Checks format of UUID response
      expect(re.test(response.data.event.meta.id)).toBe(true);
      expect(re.test(response.data.event.meta.id)).not.toBe(false);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
});

//Posts event and expects the meta id
test("Test id: 18 for FR13", async () => {
  let auth_token = "";

  let eiffelDataObj = {
    meta: {
      type: "EiffelCompositionDefinedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "231a796c-3a3a-4617-9d5b-32acce28cc7d"
    },
    data: {
      name: "myCompositionName",
      version: "42.0.7"
    },
    links: []
  };

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
  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      //Checks format of UUID response
      //console.log(response);
      expect(
        response.data.event.meta.id === "231a796c-3a3a-4617-9d5b-32acce28cc7d"
      ).toBe(true);
    })
    .catch(function(error) {
      expect(error.response.status).not.toBe(403);
    });
});
