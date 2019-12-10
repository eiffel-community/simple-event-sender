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

test("Testid: 50 for PR1", async () => {
  var id_array = [
    "12f0b2b8-501d-459b-8404-43d0ef885907",
    "e8fb60a9-ea00-49e5-b745-e066de0e01c2",
    "b6a40d0e-cd59-4ddc-a4a9-02be4bc19b67",
    "8a5d5037-d267-49f5-ab77-875a5025deff",
    "11cf5985-6fc3-4a0a-b03d-0e56dcba0f04",
    "f7a35c87-a29c-4325-9e97-6e7579738816",
    "d1294e90-fbc2-4822-9f19-637b9bbfc430",
    "e0bbf299-588d-4018-a5b6-46fca09661b5",
    "abd99f41-ae48-4a47-a62b-5069e74ae70c",
    "a6696d8a-fd47-491d-b01b-b55f2b4effc3"
  ];

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

  var eiffelDataObj = {
    meta: {
      type: "EiffelArtifactCreatedEvent",
      version: "3.0.0",
      time: 1234567890,
      id: "f46868bc-441c-47b8-bdc6-6fcb99e874da",
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
  var d_before = new Date();
  var n_before = d_before.getTime();

  const forloop = async _ => {
    for (let id = 0; id < id_array.length; id++) {
      eiffelDataObj.meta.id = id_array[id];
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
      if (id == 9) {
        var d_after = new Date();
        var n_after = d_after.getTime();
        let total = n_after - n_before;
        console.log(
          "It took " +
            total +
            " ms to post 10 events. Note that this does not work when running all tests at the same time"
        );
        expect(n_after - n_before < 1000).toBe(true);
      }
    }
  };
  await forloop();
});
