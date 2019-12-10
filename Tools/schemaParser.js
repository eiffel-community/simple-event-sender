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

var fs = require('fs');
const path = require('path')
var Ajv = require('ajv');
var ajv = new Ajv({ $data: true, allErrors: true, schemaId: 'auto' });
var GenerateSchema = require('generate-schema')
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
var instantiator = require('json-schema-instantiator');
require('./linkRequirments');
var exception = require('../modules/eventSenderException')

//The major lists to export towards other modules
schemas = []
//schemas without some required fields, for use with initial validation
simplifiedSchemas = []
examples = []
editionDic = {}

//parses the schema. requires the schema folder or the protocol downloader to run first
function readEiffelSchemas(){
 console.log("Reading schemas")
 schemaList = []
 folders = fs.readdirSync(path.join(__dirname, '../data/schemas'))
 folders.forEach((map)=>{
  schemas = fs.readdirSync(path.join(__dirname, '../data/schemas/', map))
  schemas.forEach(schema => {
   data = fs.readFileSync(path.join(__dirname, '../data/schemas/', map, schema))
   jsonSchema = JSON.parse(data)
   jsonSchemaAltered = JSON.parse(data)

   schemaList.push(jsonSchema)
   alterRequired(jsonSchemaAltered)
   simplifiedSchemas.push(jsonSchemaAltered)
 })
 })
 return schemaList
}



//Removes version, time and id from required, to pass initial validation check
function alterRequired(data){
  removeRequiredMeta = ['version','time','id']
  removeRequired = ['links']
  if(data.properties.meta.required){
  data.properties.meta.required = data.properties.meta.required.filter(entry => removeRequiredMeta.indexOf(entry)<0 ) 
}
  if(data.required){
    data.required = data.required.filter(entry => removeRequired.indexOf(entry)<0)
  }
}


//parses the examples. requires the event folder to be in place, or to run the protocol_downloader first
function readExamples(){
  console.log("Reading examples")
  exampleList = []
  folders = fs.readdirSync(path.join(__dirname, '../data/events'))
  folders.forEach((map)=>{
   examples = fs.readdirSync(path.join(__dirname, '../data/events/', map))
   examples.forEach(example => {
    data = fs.readFileSync(path.join(__dirname, '../data/events/', map, example))
    jsonSchema = JSON.parse(data)
    exampleList.push(jsonSchema)
  })
  })
  return(exampleList)
 }

//Adds enum array of valid links to schemas within links-items-type
function addLinkEnumsToAllSchemas(){
  schemas.forEach(schema=>{
    type = schema.properties.meta.properties.type.enum[0]
    md = linkRequirments[type]
    links = Object.keys(md)
    schema.properties.links.items.properties.type.enum = links
  })
}

//Returns a list of all schema types that contain the string name
function querySchema(name){
  returnSchemas = []
  for (i in schemas){
    if(getSchemaName(schemas[i]).includes(name)) returnSchemas.push(schemas[i])
  }
  if (!schemas) console.log("No schema with name: " + name + " found.")
  return returnSchemas
}

//
function matchEditiontoVersion(){
  //create four dictionaries, one for each edition
  folders = fs.readdirSync(path.join(__dirname, '/schemaversions'))
  folders.forEach((map)=>{
    mapobject = {}
    maps = fs.readdirSync(path.join(__dirname, '/schemaversions', map))
    maps.forEach((file)=>{
      //for each file in map create dictionary object, key: event type, val: version number
      data = fs.readFileSync(path.join(__dirname, '/schemaversions', map, file))
      parsedFile = JSON.parse(data)
      file = file.split(".")[0]
      mapobject[file] = parsedFile.properties.meta.properties.version.default
    })
    //push to highest dictionary level
    editionDic[map] = mapobject
  })
}

//fetches the events corresponding Schema
function matchDatatoSchema(data, edition){
  for(i in schemas){
    if(getSchemaName(schemas[i])==getDataName(data, edition)){
      return schemas[i]
    }
  }
  return null;
}

//uses version and or edition to find the correct schema "name" using editionDic object
const getDataName = (data, edition) =>{
  //check that a data or edition argument exists
  if(edition == null && data.meta.version == null){
    throw new exception.eiffelException("Please provide version or release", exception.errorType.UNSUPPORTED_EDITION)
  }
 
  //check that edition is legal
  if(edition != null && !(edition in editionDic)){
    throw new exception.eiffelException("Non-legal Eiffel release", exception.errorType.UNSUPPORTED_EDITION)
  }
  var type = data.meta.type
  //if there is a version in the event, return this as dataName
  if(edition == null && data.meta.version != null){
    return data.meta.type + " " + data.meta.version
  } 
  //if both version and edition is provided by the client, there must be a correct match
  if(data.meta.version != null && edition != null) {
    var version = editionDic[edition][type]
    if(data.meta.version == version){
      return(data.meta.type + " " + data.meta.version)
    } else {
      throw new exception.eiffelException("Edition version mismatch", exception.errorType.UNSUPPORTED_EDITION)
    }
  //if none of the other cases, return version according to edition
  } else {
    var version = editionDic[edition][type]
    return data.meta.type + " " + version  
  }
  }

//fetches the events corresponding Schema
function matchDatatoSimplifiedSchema(data,edition){
  for(i in simplifiedSchemas){
    if(getSchemaName(simplifiedSchemas[i])==getDataName(data, edition)){
      return simplifiedSchemas[i]
    }
  }
  return null;
}

function getSchemaName(schema){
  return getSchemaType(schema) + " " + getSchemaVersion(schema)
}

function getSchemaType(schema){
  return schema.properties.meta.properties.type.enum[0]
}
function getSchemaVersion(schema){
 return schema.properties.meta.properties.version.default
}

//Script to read down everything and add enums to links
function readSchemas() {
  try{  
    schemas = readEiffelSchemas()
  }catch(err){
    console.log(err)
  }

  try {
    examples = readExamples()
  }catch(err){
    console.log(err)
  }

  addLinkEnumsToAllSchemas()
  matchEditiontoVersion()
}

//Schemas is list of all Json schemas. Examples is example data from git folder. 
//GetDataName returns name of examples type + version. getSchemaName returns string of type + version
//Validate returns true false if valid and runs callback (second parameter)

module.exports = {matchDatatoSimplifiedSchema,schemas,examples,getDataName,getSchemaName,
  matchDatatoSchema,getSchemaType,getSchemaVersion, readSchemas}

/* 
____________¶¶
___________¶¶¶¶
__________¶¶¶¶¶¶
_________¶¶¥¥¥¶¶¶
________¶¶¥¥¥¥¥¶¶¶__________________________________________¶¶¶¶¶¶¶¶
________¶¶¥¥¥¥¥¥¶¶¶_____________________________________¶¶¶¶¶¥¥¥¥¥¶¶
________¶¶¥¥¥¥¥¥ƒƒ¶¶________________________________¶¶¶¶¥¥¥¥¥¥¥¥¶¶¶¶                -- PIKA PIKA
________¶¶¥¥¥¥ƒƒƒƒƒ¶¶___________________________¶¶¶¶ƒƒ¥¥¥¥¥¥¥¥¶¶¶¶
________¶¶¶ƒƒƒƒƒƒƒƒ§¶¶________________________¶¶ƒƒƒƒƒƒƒ¥¥¥¥¥¶¶¶¶
_________¶¶¶ƒƒƒƒƒƒ§§¶¶____________________¶¶¶¶ƒƒƒƒƒƒƒƒƒƒ¥¥¶¶¶¶
___________¶¶ƒƒƒƒƒ§§¶¶__________________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¶¶¶¶
____________¶¶ƒƒ§§§§¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§¶¶
_____________¶¶§§§§§§§ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§¶¶
______________¶¶§§§ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§¶¶¶¶___________________¶¶¶¶¶¶
____________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§¶¶¶____________________¶¶¶ƒƒƒƒƒ¶¶
__________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¶¶¶¶¶¶ƒƒƒƒ§§§¶¶¶___________________¶¶ƒƒƒƒƒƒƒƒ¶¶
_________¶¶ƒƒ¶¶¶¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¶¶__¶¶¶¶ƒƒƒ§§§§§¶¶________________¶¶ƒƒƒƒƒƒƒƒƒƒ¶¶
________¶¶ƒƒ¶¶__¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¶¶¶¶¶¶¶¶ƒƒƒ§§§§§§¶¶___________¶¶¶¶ƒƒƒƒƒƒƒƒ§§§§§§¶¶
_______¶¶ƒƒƒ¶¶¶¶¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¶¶¶¶¶¶ƒƒƒƒƒ§§§§§§¶¶________¶¶ƒƒƒƒƒƒƒƒ§§§§§§§§§§¶¶
_______¶¶ƒƒƒƒ¶¶¶¶ƒƒƒƒƒ¥¥¥ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ####§§§§§¶¶____¶¶¶¶ƒƒƒƒƒƒƒƒ§§§§§§§§§§§§¶¶
_______¶¶###ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¥¥ƒƒƒƒƒƒ########§§§§¶¶¶¶¶¶ƒƒƒƒƒƒƒƒ§§§§§§§§§§§§§§§§¶¶
_______¶¶####ƒƒƒƒƒƒƒƒ¥¥¥¥¥¥¥¥¥¥¥ƒƒƒƒƒƒ########§§¶¶¶¶ƒƒ¶¶¶¶ƒƒƒƒ§§§§§§§§§§§§§§§§§§¶¶
____¶¶¶¶¶¶###ƒƒƒƒƒƒƒƒƒ¥¥¥#####¥ƒƒƒƒƒƒƒ########¶¶ƒƒ¶¶ƒƒƒƒƒƒ¶¶§§§§§§§§§§§§§§§§§§§§¶¶
__¶¶¶ƒƒ¶¶¶¶#ƒƒƒƒƒƒƒƒƒƒ¥¥####¥¥ƒƒƒƒƒƒƒƒƒƒ####§§¶¶ƒƒƒƒƒƒƒƒ¶¶¶¶§§§§§§§§§§§§§§§§¶¶¶¶
_¶¶ƒƒ¶ƒƒƒƒ¶¶ƒƒƒƒƒƒƒƒƒƒƒƒ¥¥¥¥ƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§¶¶ƒƒƒƒƒƒƒƒƒƒƒƒ¶¶§§§§§§§§§§§§¶¶¶¶
¶¶ƒƒƒƒƒƒ§§§§¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ¶¶ƒƒƒƒƒƒƒƒ§§§§¶¶§§§§§§§§§§¶¶¶¶
__¶¶ƒƒ§§§§§§¶¶¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§¶¶¶§§§§§§§§¶¶
____¶¶§§§§§§§¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§¶__¶§§§§§§¶¶
______¶¶§§§§§§ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§¶¶____¶¶§§§§§§¶¶
________¶¶¶§ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§¶¶_______¶¶§§§§§§¶¶
_________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§¶¶¶¶____¶¶¶¶§§§§§§§§§§¶¶
_________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§¶¶§§¶¶¶¶¶¶ƒƒ§§§§§§§§¶¶¶¶
________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§¶¶ƒƒƒƒ§§§§§§¶¶¶¶
________¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§§¶¶§§§§§§§¶¶¶¶
__¶¶¶¶¶¶¶¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§§§¶¶§§§§§§¶¶
_¶¶ƒƒ¶¶ƒƒƒ¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§§§¶¶¶¶§§§§§§¶¶
_¶¶ƒƒƒ¶¶ƒƒƒ¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§§§§¶¶__¶¶¶###§§§¶¶
__¶¶§§§§§§§§¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§§§§§§§¶¶¶¶¶#######§§§¶¶
___¶¶§§§§§§§§¶¶ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ§§§§§§§§§§§§§§§§§########¶¶¶¶¶¶
____¶¶§§§§§§§§¶¶§§§§ƒƒƒƒƒƒƒ§§§§§§§§§§§§§§§§§§§####¶¶¶¶¶¶
_____¶¶§§§§§§§¶¶§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§¶¶¶¶
_______¶¶¶¶¶¶¶§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§¶¶
______________¶¶¶¶¶¶¶¶¶¶§§§§§§§§§§§§§§§§§§§§¶¶
________________________¶¶¶¶¶¶§§§§§§§§§§¶¶¶¶
____________________________¶¶¶¶§§§§¶¶¶¶¶
____________________________¶¶§§§§§§§§¶¶
____________________________¶¶§§¶¶§§§¶¶
_____________________________¶¶§¶¶§§¶¶
______________________________¶¶¶¶¶¶ */