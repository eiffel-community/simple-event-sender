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
 * Listen to the message bus.
 * Call initRabbitMQConsumer() to start listening.
 * Author Oscar Andell
 * https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
 */

const exception = require('../modules/eventSenderException');
const amqp = require('amqplib');
const eventDb = require('../modules/dbConnectionHandler');
const validator = require('../Tools/validation');
const dataGenerator = require('../Tools/dataGenerator');
const queue = 'event_queue';

exports.initRabbitMQConsumer = function () {
    let user = process.env.RABBITMQ_USER;
    let password = process.env.RABBITMQ_PASSWORD;
    let url = process.env.RABBITMQ_URL;

    return new Promise((resolve, reject) => {
         amqp.connect('amqp://' + user + ':' + password + '@' + url).then((connection) => {
            connection.createChannel().then((channel) => {
                channel.assertQueue(queue, {
                    durable: false
                });
                
                console.log("Listening for messages in %s in the RabbitMQ", queue);
               
                channel.consume(queue, function(msg) {

                    receivedEvent = JSON.parse(msg.content.toString());
                        validator.validate(receivedEvent).then(() => {
                            eventDb.saveEvent(receivedEvent,() => {
                                console.log("Received event with id: %s from RabbitMQ Message bus, save to eventDB", receivedEvent.meta.id);
                            })
                            
                        }).catch(()=>{
                            console.log("Received %s from RabbitMQ Message bus, NOT VALIDATED, DISCARDING", msg.content.toString());
                        });
                }, {
                    noAck: true
                });
                resolve(true);
                return;

            }).catch((err) => {
                reject(new exception.rabbitMQException(err));
            });
          })
          .catch((err) => {
                reject(new exception.rabbitMQException(err));
          });
    })
};
