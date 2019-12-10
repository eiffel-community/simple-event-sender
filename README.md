<img width="103" height="125" src="doc/img/logo_white.png" align="right" />

# SimpleEventSender

## What is SimpleEventSender?


The SimpleEventSender is a product designed for handling Eiffel events. 
Its purpose is too look up, store and complete Eiffel events. A human user or a robot 
can input an event into the SimpleEventSender. The event will then be validated, and 
missing data will be completed by the system. The result is then sent as a complete, 
generated Eiffel JSON object through a message bus. The SimpleEventSender then responds to the user with 
an event ID or error message. The goal of all this is to reduce the burden on the client. 

## What is an Eiffel Event?

An Eiffel event has a set syntax and
can be in different forms. An example of a Eiffel event is e.g “EiffelConfidenceLevelModifiedEvent”. 
Usually this event is used to signal that something has reached a certain level of confidence. 
Perhaps the latest version of your login service has passed the acceptance test. Most Eiffel events are 
formatted in a small JSON document, containing 3 main objects: meta, data and links.  

## What is the Eiffel Protocol? 
Eiffel in its most basic form has 2 main fragments. First are the syntax of events
 and vocabulary used for forming a communication protocol for the framework. 
 Secondly there are the services built on top of that communication protocol to 
 orchestrate continuous integration etc. The Eiffel protocol was initially created at Ericsson and
  is now open source for anyone to contribute to. 
  
More information about Eiffel can be found 
[here](https://github.com/eiffel-community/eiffel/blob/master/introduction/introduction.md).

## Product included features
- RabbbitMQ Interface. The product takes use of RabbitMQ message bus for handling 
information flow between the user and the the application. 

- Basic Access Authentication. The product uses JSON web token (JWT) in order to authenticate users. 

- Front-end. SimpleEventSender comes with a basic front-end to allow for simple usage
 of the product for human users. 

- API.  The product is built on a REST API using the Node.js framework Express.js. 
REST API was chosen due to its stateless nature. 

- Eiffel Event Database. A MongoDB used for storing Eiffel events. 

- User Database. A MongoDB used for storing mock users. 

## Dependencies

- Docker

## Local run with Docker

- Install Docker
- In the git repository run command: " docker-compose up "
- Go to `http://localhost:9000/` to check if running correctly.

## Installation and setup
This guide aims at introducing how to deploy nginx as a reverse proxy on the Docker Compose containers. 
After that, a real HTTP address can be used to use the application. 
Prerequisites:
- A domain name
- An A record has been applied (domain name pointing to IP address)

### Step 1 Clone the repository
`git clone -b branch_name https://gitlab.liu.se/aaksu864/tdde-45-company-5-project.git SimpleEventSender`

### Step 2 Define the nginx configuration on the Docker
To deploy nginx in the docker compose, we need to create the configuration
 file in the project directory. Create the "nginx-conf"-folder in the project directory and add
 [nginx.conf](doc/config/http/nginx.conf) to the folder.
Remember to replace example.com with your own domain name. You can add more than one domain name in the
 place without extra parameters. Pay attention to the proxy_pass
 containing simple_event_sender which is the service name of the application.
 
### Step 3 Create Docker Compose file
The docker-compose.yml file will define our services, including the Node application and web server.
Add [docker-compose.yml](doc/config/http/docker-compose.yml) to the project directory.
In the docker-compose.yml file, replace user_name with the “real username” of the server. 
More precisely, it is the directory where you clone the repository on. 
For example, the system admin’s username is abcde123. The project was downloaded in 
/home/abcde123/SimpleEventSender directory, so abcde123 is the username to be used while configuring.

### Step 4 Configure mock-user for /login route
The current version of The Simple Event Sender uses a hard-coded user for testing
 basic authentication functionality. It is currently created on server start in the 
 server.js file, unless it’s previously been created and already exists in the user 
  database. This functionality could easily be moved into its own /createUser 
  endpoint in the future for a more realistic real-life approach. This endpoint 
  could be configured using existing functionality and only swapping out the hard-coded 
  variables to instead retrieve them from ex. the HTTPs body request.

### Step 5 Start running
After configuration, use `docker-compose up` to run the containers on the server.
Access the application through http://your_domain_name

### Step 6 Redirect HTTP to HTTPS (optional)
In this step, we need to modify the nginx-conf/nginx.conf and docker-compose.yml 
to redirect HTTP to HTTPS. It will take about 2-3 minutes to generate the Diffie-Hellman 
key needed to perform this step.
```
docker-compose stop webserver   
mkdir dhparam
sudo openssl dhparam -out /home/user_name/SimpleEventSender/dhparam/dhparam-2048.pem 2048   
```

Replace the old nginx.conf file with the following HTTPS-configured [nginx.conf](doc/config/https/nginx.conf)
in the nginx-conf folder. Replace the old docker-compose.yml file with the following HTTPS-configured
[docker-compose.yml](doc/config/https/docker-compose.yml). After modifying, restart the webserver.
`docker-compose up -d --force-recreate --no-deps webserver`

## API
### /submitevent
The request shall contain a body which contains JSON objects. 

The semantics of the input object is: 
`{eiffelDataObj: object, dataObject, parameterObject: parameters, lookupObject: object}` 

The allowed objects are labeled as follows:

- eiffelDataObj: Contains the Eiffel object. The object is defined by the following syntax:
    - `eiffelDataObj : { } `
    -  eiffelDataObj is required
- lookupObj: Contains the lookup object. The object is defined by the following syntax:
    - `"lookupObj" : { } `
    - lookupObj is not required
    - Contains a list of links that for each link has a link type, and can have two parameters for each link that 
    is labled “allowSeveralMatches” and “allowMissingMatch”
- parameterObj: Contains the parameter object. The object is defined by the following syntax:
    - `parameterObj" : { } `
    - parameterObj is required
    - It must contain a key “edition” that only supports a value of type string. This string can only be “agen-1” 
    - It can contain a parameter that has the key “sendToMessageBus” that is of type Boolean and can be either 
    true or false 
    
An example of what a body-object can look like with all optional input objects present on the highest object level: 
```
{  
"eiffelDataObj" : { 
  "meta": { 
    "type": "EiffelConfidenceLevelModifiedEvent", 
    "version": "3.0.0", 
    "time": 1234567890, 
    "id": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee0" 
  }, 
  "data": { 
    "name": "stable", 
    "value": "SUCCESS", 
    "issuer": { 
      "name": "Gary Johnston", 
      "email": "gary.johnston@teamamerica.com", 
      "id": "garyj", 
      "group": "Team America" 
    } 
  }, 
  "links": [ 
    { 
      "type": "CAUSE", 
      "target": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee1" 
    }, 
    { 
      "type": "CAUSE", 
      "target": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee2" 
    }, 
    { 
      "type": "SUBJECT", 
      "target": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee3" 
    }, 
    { 
      "type": "SUBJECT", 
      "target": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee4" 
    }, 
    { 
      "type": "SUB_CONFIDENCE_LEVEL", 
      "target": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee5" 
    }, 
    { 
      "type": "SUB_CONFIDENCE_LEVEL", 
      "target": "aaaaaaaa-bbbb-5ccc-8ddd-eeeeeeeeeee6" 
    } 
  ] 
}, 

"lookupObj" : { 
    "links": [ 
        { "linkType": "SUBJECT", 
          "allowSeveralMatches": true, 
          "allowMissingMatch": true, 
          "query": { 
              "data.identity" :"gitID:250203" 
          } 
        },  
        { 
            "linkType": "CAUSE", 
            "query": { 
                "data.gitCommitID" : "1250812587125" 
            } 
        } 
    ]
}, 

"parameterObj" : { 
    "sendToMessageBus" : true, 
    "edition"          : "agen-1" 
} 
} 
```

### /login
The request body shall contain a JSON object with the following parameters: 
```
{ 
     “name”: username, 
     “password”: password 
} 
```
The response will then return a token to the user which allow him to
verify himself on the /submitevent route. The token will be sent in the header
of the response in the following format: auth-token: “generated token”. 

## RabbitMQ

RabbitMQ is a message broker where services can listen and send messages between one another. https://www.rabbitmq.com/.

- The GUI for RabbitMQ can be found at `http://localhost:15672/`
- After login you can view message queues and messages being sent.

## Testing
A complete guide to testing can be found in the [Wiki](doc/wiki.html)

The testing is done with the help of the Jest framework. Tests are done by first starting the docker container. Then in a separate terminal run:

- `npm test`

Output is saved in a html-report in tests->test_reports

## Changelog

2019-12-09
- Added installation and setup guide for http/https
- Added section about API
- Removed troubleshooting section
- Removed section about testing
- Removed git guidelines and issue tracking sections
- Removed CI section from Testing

2019-11-20
- Add section about continuous integration 

2019-11-13

- Added instuctions to run tests.

2019-10-31

- Remove instructions for running without docker. (No longer feasable with the introduction of rabbitMQ dependency)
- Reformat headings and add code highlighting.

2019-10-17

- Added chapter about issue tracking

2019-10-12:

- Add tips and tricks section for Docker

2019-10-10:

- Added instructions for running with Docker
- Added troubleshooting section for running the Docker in Windows

2019-10-09:

- Changed merge request rule from being reviewed by Karl Söderbäck to any peer.
- Added instructions for bugfix branches.

## Authors of this readme: 
- Karl Söderbäck
- Oscar Andell
- Boris Wu
- Teodor Lennmark
- Tong Zhang

## Simple Event Sender Developed by:
- Teodor Lenmark
- Oscar Andell
- Albin Ringertz
- Emil Strandberg
- Alice Velander
- Edvin Ljungstrand
- Viktor Gustafsson
- Karl Söderbäck
- Felix Kimiaei

## UX/Front-end by:
- Felicia Dahlström
- Andreas Behrendtz
- Axel Holmberg

## Tests by:
- Tomas Gudmundsson
- Axel Holmberg
- David Björelind
- Anders Jåfs
