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

//Posts an event without a version and expects the server to fill in that depending on chosen edition in parameterObj.
// "toulouse" in this test
test("Testid: 31 for FR33", async () => {
  let auth_token = "";
  var parameterObj = {
    sendToMessageBus: true,
    edition: "toulouse"
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

  let eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "",
      time: 1234567890,
      id: "5a880e0e-83ee-4368-986c-22768210bba9",
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
      }
    ]
  };

  await Axios.post(
    "http://localhost:9000/submitevent",
    { eiffelDataObj, parameterObj },
    config
  )
    .then(function(response) {
      expect(response.status).not.toBe(200);
      // Commented for now, since product does not have support
      //expect(response.data.event.meta.version).toBe("1.1.0");
    })
    .catch(function(error) {
      //console.log(error.response.data);
      expect(error.response.status).toBe(403);
      expect(error.response.data["Error Type"]).toBe("UNSUPPORTED_EDITION");
    });
});
