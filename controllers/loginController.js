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

const exception = require('../modules/eventSenderException');
const User = require('../models/userModel');
const JWToken = require('jsonwebtoken');
const messageModule = require('../modules/messageModule');
const dotenv = require('dotenv');
const userDbInterface = require('../modules/userDbInterface');
const bcrypt = require('bcryptjs');
dotenv.config();

/**
 * EXPECTED INPUT: {name: "name", password: "password"}
 * OUTPUT: Success response + token OR error exception.
 * 
 * Uses bcrypt and JSON web token
 */
exports.post = async function (req, res) {

  const user = await userDbInterface.findUser(req.body.name);

  try {
    if (user != null) {
      validPW = await bcrypt.compare(req.body.password, user.password)
      if (validPW) {
        const token = JWToken.sign({ _id: user.id }, process.env.SECRET_TOKEN);
        res.header('auth-token', token);
        messageModule.sendAuthSuccessRespone(res);
      } else {
        throw new exception.authorizationException("Wrong password or username", exception.errorType.WRONG_PASSWORD_OR_USERNAME);
      }
    } else {
      throw new exception.authorizationException("Wrong password or username", exception.errorType.WRONG_PASSWORD_OR_USERNAME);
    }
  } catch (e) {
    messageModule.sendFailResponse(res, e);
  }
}
