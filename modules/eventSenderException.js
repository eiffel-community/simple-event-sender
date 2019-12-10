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
* The eventSenderException contains default exceptions that are
* for example thrown in the validation process when a validation fails.
*/
class eventSenderException extends Error {
    constructor(message, code, errorType) {
        super(message);
        this.name = 'EventSenderException';
        this.message = message;
        this.eventSenderErrorCode = code;
        this.errorType = errorType;
    }
}

class databaseException extends eventSenderException {
    constructor(message, errorType) {
        super(message, 1400, errorType);
        this.name = 'DatabaseException';
    }
}

class lookUpException extends eventSenderException {
    constructor(message, errorType) {
        super(message, 1500);
        this.name = 'lookUpException';
    }
}


class rabbitMQException extends eventSenderException {
    constructor(message, errorType) {
        super(message, 1200, errorType);
        this.name = 'RabbitMQException';
    }
}

class authorizationException extends eventSenderException {
    constructor(message, errorType) {
        super(message, 1100, errorType);
        this.name = 'AuthorizationException';
    }
}

class eiffelException extends eventSenderException {
    constructor(message, errorType) {
        super(message, 1300, errorType);
        this.name = 'EiffelException';
    }
}

const errorType = {
    //eventSenderErrorMessage - 1000
    INVALID_OBJECT_CREATED: "INVALID_OBJECT_CREATED",

    //authorizationErrorMessage - 1100
    WRONG_PASSWORD_OR_USERNAME: "WRONG_PASSWORD_OR_USERNAME",
    BAD_TOKEN: "BAD_TOKEN",

    //rabbitMQErrorMessage - 1200
    CONNECTION_ERROR: "CONNECTION_ERROR",
    CHANNEL_ERROR: "CHANNEL_ERROR",

    //eiffelErrorMessage - 1300
    INVALID_PARAMETER_OBJECT: "INVALID_PARAMETER_OBJECT",
    UNSUPPORTED_EDITION: "UNSUPPORTED_EDITION",
    INVALID_SCHEMA: "INVALID_SCHEMA",
    MISSING_LINKS: "MISSING_LINKS",
    ILLEGAL_LINK_TARGET: "ILLEGAL_LINK_TARGET",
    UUID_NOT_UNIQUE: "UUID_NOT_UNIQUE",
    LINK_MATCH_NOT_FOUND: "LINK_MATCH_NOT_FOUND",
    MULTIPLE_LINKS_FOUND: "MULTIPLE_LINKS_FOUND",

    //databaseErrorMessage - 1400
    DUPLICATE_UUID_ERROR: "DUPLICATE_UUID_ERROR"
    //lookupErrorMessage - 1500
};


module.exports = {
    eventSenderException,
    databaseException,
    rabbitMQException,
    eiffelException,
    authorizationException,
    lookUpException,
    errorType
}
