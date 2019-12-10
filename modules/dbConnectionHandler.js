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
https://stackoverflow.com/questions/19474712/mongoose-and-multiple-database-in-single-node-js-project

Author Oscar Andell
*/

dbName = 'eventDB'
//-------DEPRECATED ---------  USE "npm start -- ci" to run with mongo on localhost url  
//const runInDocker = true
//const mongoDBlocation = runInDocker ? process.env.MONGODB_URL : "localhost"
//-------DEPRECATED ---------



const Mongoose = require('mongoose').Mongoose;
let userDB = new Mongoose();
const MongoClient = require('mongodb').MongoClient;
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }; //Options for db instantiation

var db = null;
const assert = require('assert');
connecting = false;

exports.getUserDBInstance = ()=>{
    return userDB
}

//connects to the database and runs cb callback function
exports.databaseConnect = (cb) => {
  const userDbURL =  "mongodb://" + process.env.MONGODB_URL + "/userDB";
  const eventDbURL = "mongodb://" + process.env.MONGODB_URL + "/" + dbName;
  connecting = true;
  if(db){
    cb();
  }
  else{
    MongoClient.connect(eventDbURL, mongoOptions, (err, client) => {
      if(err){
        cb(err)
      }
      else{
        console.log("Connected to Event DB")
        db = client.db(dbName);
        connecting = false
        cb();
      }
      });


      userDB.connect(userDbURL,mongoOptions, (err) => 
      {
          if(err){
              cb(err)
          }else{
              console.log("Connected to User DB")
          }
      });
  }  
}

//return database object. To be used in other modules. Runs cb as callback function returns null and callback error if database is not connected
 exports.getEventDBInstance = (cb) => {
    msg = true
    if (db!=null) cb(db)

    else if(connecting){
        if (msg) console.log("tried to get DB while connecting, waiting for connection..")
        msg = false
        connectionWait = setInterval(()=>{
            if(db){
                clearInterval(connectionWait)
                cb(db)
            }
        },500)
    }
    else {
        cb(null,"Database Connection not started")
        return null
    }
}

//Saves an event to the database collection corresponding to the event type and version
exports.saveEvent = (event,cb) =>{
  //######## Add below code when example data does not have duplicate keys  
    event["_id"] = event.meta.id
    db.collection(event.meta.type).insertOne(event)
    cb()
}

//Loads Examples from Eiffel git repository example folder
exports.loadExamples = ()=>{
    for(i in examples){
        exports.saveEvent(examples[i],(err)=>{
            assert.equal(err,null)
        })
        
    }
    console.log("saved all exampleEvents to db")
}


//type = meta.type, version = X.X.X, UID = meta.id, projection = {xxx: 1}
//Basic query function to fetch a field from a known event in the database
exports.basicQuery = (db, type, version, UID, projection, linkType, cb) => {
  linkType = linkType
  var collection = db.collection(type)
  if (projection){
    var myCursor = collection.find({"meta.id" : UID}).project(projection)
  }
  else {
    var myCursor = collection.find({"meta.id" : UID})
  }
  myCursor.count(function(err, count) {
    if(count == 0) {
      cb(data, count, UID, linkType)
  } else {
      myCursor.forEach(function (data) {  
      cb(data, count, UID, linkType) 
      }) 
  }
})
}