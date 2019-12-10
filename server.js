/* Copyright 2019 Evsent

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/
var cors = require("cors");

let commandLineArguments = process.argv.slice(2);
if (
  commandLineArguments.length > 0 &&
  commandLineArguments[0].toLowerCase() === "ci"
) {
  console.log("Starting in CI mode");
  process.env.RABBITMQ_URL = "localhost:5672";
  process.env.MONGODB_URL = "localhost:27017";
}

var cors = require("cors");
var routes = require('./routes/routes.js'); //importing route
const express = require('express');
const dbConnectionHandler = require('./modules/dbConnectionHandler.js');
const userDbInterface = require('./modules/userDbInterface.js');
const rabbitMQConsumer = require('./modules/rabbitMQConsumer.js');
const rabbitMQPublisher = require('./modules/rabbitMQPublisher.js');
const protocolDownloader = require('./Tools/protocol_downloader.js');
const schemaParser = require('./Tools/schemaParser.js')

const app = express();
app.use(cors({ exposedHeaders: ["auth-token"] }));
const port = process.env.PORT || 9000;
const dotenv = require("dotenv"); //For loading hidden variables
dotenv.config();
const pug = require("pug");
const bcrypt = require("bcryptjs");
dbConnectionHandler.databaseConnect(err => {
  if (err) console.log(err);
});

// Download Schemas and then reads schemas to schemaParser
// then makes the server listen to selected port
function startServer() {
  protocolDownloader
    .getSchemas()
    .catch(e => process.exit(1))
    .then(() => schemaParser.readSchemas())
    .then(() =>
      app.listen(port, () => console.log(`Server starting at port: ${port}!`))
    );
}

startServer();

async function connectToRabbitMQ() {
  try {
    await rabbitMQConsumer.initRabbitMQConsumer();
  } catch (e) {
    console.log("Could not connect to RabbitMQ, retrying in 10 seconds.");
    setTimeout(function() {
      connectToRabbitMQ();
    }, 10000);
  }
}
connectToRabbitMQ();

app.use(express.json()); //Make it possible to parse Request body
app.use(express.urlencoded());
app.use(express.json());
app.set("view engine", "pug");

/* Temporary solution for development testing */
bcrypt.genSalt(10, function(err, salt) {
  //add test user with hashed password to userDB
  bcrypt.hash("password123", salt, function(err, hash) {
    userDbInterface.addUser("Albin", hash);
  });
});

routes(app); //register the route
