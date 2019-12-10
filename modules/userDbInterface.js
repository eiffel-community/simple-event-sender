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


/*
Module for handleing operations the user database. 
Author: Oscar Andell
*/
User = require('../models/userModel');

/**
 * Insert user into database if user already not exists. 
 */
exports.addUser = function(username, hashedPassword){
    User.findOne({name: username}, function(err, result) {
        if (err) {console.log('User already exists')}
        if (!result) {
            const newUser = new User({
                password: hashedPassword, 
                name: username
            });
            newUser.save();
        }
    })
}

exports.findUser = async function(username){
    return User.findOne({name: username});
}

exports.deleteUser = async function(username){
    //TODO
}


