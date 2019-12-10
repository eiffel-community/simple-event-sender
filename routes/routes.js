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


module.exports = function(app) {
    var defaultController = require('../controllers/defaultController.js');
    var submitEventController = require('../controllers/submitEventController.js')
    var loginController = require('../controllers/loginController.js');
    /**
     * Default endpoint. No functionality. 
     * GET:
     *    Return :
     */
    app.route('/')
    .get(defaultController.get);
    /**
     * Endpoint for Login. 
     * GET: -
     * POST: 
     *    Input: {"name":name, "password":password}
     *    Return: auth-token 
     */
    app.route('/login')
    .post(loginController.post);
    /**
     * Endpoint for submitting eiffel event. Authentication token required. 
     * See documention for complete API input parameters
     * 
     * GET: -
     * POST: 
     *    Input: {
     *          eiffelDataObj : { ... },
     *          parameterObj : { ... },
     *          lookupObj : { ... }
     *    }
     *    RETURN:  
     */
    app.route('/submitevent')
      .get(submitEventController.get)
      .post(submitEventController.post)
    };

