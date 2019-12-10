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

/**
* The messageModule contains default functions that are used
* when sending responses to the client. All responses from
* the server to the client are going through the messageModule.
*/

/**
* The sendCreateEventSuccessResponse is used when communicating a successful submit.
*/
module.exports.sendCreateEventSuccessResponse = function(res,event) {
  res.status(200).json({message: "Successfully created event", event : event});
}

/**
* The sendCreateEventSuccessResponse is used when communicating a successful login.
*/
module.exports.sendAuthSuccessRespone = function(res) {
  res.status(200).json("Authorization successful");
}

/**
* The sendCreateEventSuccessResponse is used when communicating an fail because of an exception.
*/
module.exports.sendFailResponse = function(res, exception) {
  res.status(403).header("EventSenderErrorCode", exception.eventSenderErrorCode).json({"Error Type" : exception.errorType, "Error Message" : exception.message});
}
