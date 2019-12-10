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

const path = require('path');
const fs = require('fs');
var clone = require('git-clone');


//NOTE: Do NOT run this script with nodemon, run it with node

//Removes the folder defined by dirPath recursively by first deleting it's children
function removeDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    var list = fs.readdirSync(dirPath);
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dirPath, list[i]);
        var stat = fs.statSync(filename);

        if (filename == "." || filename == "..") {
            // do nothing for current and parent dir
        } else if (stat.isDirectory()) {
            removeDir(filename);
        } else {
            fs.unlinkSync(filename, (err) =>{
                if(err) throw err;
                else console.log('File successfully deleted');
            });
        }
    }
    fs.rmdirSync(dirPath);
};


//fetch the schema and exampleevent folder from the eiffel git repository
exports.getSchemas = function(){
    var renamerSyncRuns = 0
    var getExamples = true;
    var getMDfiles = true;
    var movesBeforeDel = 1 + (getExamples ? 1 : 0) + (getMDfiles ? 1 : 0);

    return new Promise((resolve, reject) => {
    //moves the folder name to target path
        function renamerSync(name, target, myVar){
            fs.renameSync(name, target)
            console.log('Sucessfully fetched: ' + target);
            clearInterval(myVar);
            renamerSyncRuns += 1
        }

        function runRenamer(name, target, myVar){
            if (fs.existsSync(name)){
                renamerSync(name, target, myVar);
            } else {
                process.stdout.write(".")
            }
        }

        //removes previous folders before downloading new eiffel git repository
        if (fs.existsSync('./data/MD')){
               removeDir('./data/MD');
        }
        if (fs.existsSync('./data/events')){
            removeDir('./data/events');
        }
        if (fs.existsSync('./data/schemas')){
            removeDir('./data/schemas');
        }
        if (fs.existsSync('./data/eiffel')){
           removeDir('./data/eiffel')
        }

         //Clones new repository
        clone('https://github.com/eiffel-community/eiffel', './data/eiffel');
        process.stdout.write("Fetching eiffel git repository.");

        var schemaMoveInterval = setInterval(function() {runRenamer('./data/eiffel/schemas', './data/schemas', schemaMoveInterval);}, 1000);
        if (getExamples) {
            var eventMoveInterval = setInterval(function() {runRenamer('./data/eiffel/examples/events', './data/events', eventMoveInterval);}, 1000);
        }  
        if (getMDfiles){
            var mdMoveInterval = setInterval(function() {runRenamer('./data/eiffel/eiffel-vocabulary', './data/MD', mdMoveInterval);}, 1000);
        }
        var removeDirInterval = setInterval(()=> {
            if(renamerSyncRuns==movesBeforeDel){
                removeDir('./data/eiffel');
                clearInterval(removeDirInterval);   
                resolve();
            }
        
        }, 1500)
        setTimeout(function() {reject()}, 30000)
    })
}

//getSchemas();