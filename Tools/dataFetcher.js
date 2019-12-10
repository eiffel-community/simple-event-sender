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

dbh = require("../modules/dbConnectionHandler")
require("./linkRequirments")
require("./schemaParser")
const assert = require('assert');
const exception = require('../modules/eventSenderException');


async function find(legalLinkEventType, query, db, linkType, returnArr) {
    return new Promise((resolve,reject)=> {
        db.collection(legalLinkEventType).find(query, { projection: { _id: 0, "meta.id": 1, "meta.type": 1 } }).toArray((err, foundLinks) => {
            if(foundLinks){
                foundLinks.forEach(link => {
                returnArr.push({ type: linkType, target: link.meta.id, eventType: link.meta.type })
                console.log("Found linktype " + linkType + " to " + link.meta.type + ". id: " + link.meta.id)
            })
            resolve()
        }
        })
    })
}


//Returns a promise that sends found links for query and linkType multiple is set to linkreqs if not given
async function findLinkIDs(event, query, linkType, allowSeveralMatches=false, allowMissingMatch=false) {


    return new Promise((resolve,reject)=>{
        dbh.getEventDBInstance((db, err) => {
            returnArr = []
            promises = []
            assert.equal(err,null)
            //If event type exists in linkRequirments


            if(linkRequirments[event.meta.type] == null){
              reject(new exception.eventSenderException("Invalid EventType",1000,exception.errorType.INVALID_OBJECT_CREATED))
            }
            if(linkRequirments[event.meta.type][linkType] == null) {
              reject(new exception.eventSenderException("Invalid LinkType",1000,exception.errorType.INVALID_OBJECT_CREATED))
            }
                legalLinks = linkRequirments[event.meta.type][linkType]["legal_targets"]
                multiple = linkRequirments[event.meta.type][linkType]["multiple_allowed"]


            if (legalLinks === "any") legalLinks = Object.keys(linkRequirments)
            //set the query as {field: fieldval}
            if(legalLinks){
            legalLinks.forEach(legalLinkEventType => {
                promises.push(find(legalLinkEventType, query, db, linkType, returnArr))
            })
        }

                 Promise
                .all(promises)
                .then(() => {

                    if(returnArr.length==1){
                        resolve(returnArr)
                    }
                    if(returnArr.length==0){
                        if(allowMissingMatch){
                            resolve()
                        } else{
                            reject(new exception.lookUpException("No matches found and allowMissingMatch false for linkType: " + linkType, exception.errorType.LINK_MATCH_NOT_FOUND))

                        }
                    }
                    if(returnArr.length>1){
                        if(multiple && allowSeveralMatches){
                            resolve(returnArr)
                        } else{
                            if(!multiple && !allowSeveralMatches) reject(new exception.lookUpException("Multiple possible links for link: " + linkType, exception.errorType.MULTIPLE_LINKS_FOUND))
                            if(!multiple) reject(new exception.eiffelException("Multiple possible links and Eiffel standard rejects multiple links for " + event.meta.type +  " for linktype: " + linkType, exception.errorType.MULTIPLE_LINKS_FOUND))
                            if(!allowSeveralMatches) reject(new exception.lookUpException("Multiple possible links and allowSeveralMatches is false for link: " + linkType, exception.errorType.MULTIPLE_LINKS_FOUND))

                        }
                    }
                })
        })

    })
}

module.exports = { findLinkIDs }
