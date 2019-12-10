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
 * Sends events to Message Bus by calling sendToMessageBus(msg).
 * Closes connection after each message. 
 * Author Oscar Andell
 * https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
 */
const amqp = require('amqplib/callback_api');
const queue = 'event_queue';

exports.sendToMessageBus = function(msg, messageSent){
    let user = process.env.RABBITMQ_USER;
    let password = process.env.RABBITMQ_PASSWORD;
    let url = process.env.RABBITMQ_URL;
    amqp.connect('amqp://'+user+':'+password+'@'+url, function(error0, connection) {
        if (error0) {
            messageSent(false, error0);
        }
        connection.createConfirmChannel(function(error1, channel) {
            if (error1) {
                messageSent(false, error1);
            }

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg),{},
                function(err, ok) {
                    if (err !== null) {
                        console.warn('Message nacked!');
                        messageSent(false, err);
                    }
                    else {
                        console.log("Sent event with id: %s to RabbitMQ", JSON.parse(msg).meta.id);
                        messageSent(true, null);
                    }
                    });
            channel.waitForConfirms(function(err){
                if(err){
                    console.error(err);
                    messageSent(false, err);
                }else{
                    connection.close();
                }
            });     
        });
    });
}

