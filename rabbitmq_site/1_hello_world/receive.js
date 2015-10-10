#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {

  console.log('connect complete');
  if (err) {
    console.log('error: ', err);
    process.exit(1);
  }

  conn.createChannel(function (err, ch) {
    console.log('create channel complete');
    if (err) {
      console.log('error: ', err);
      process.exit(1);
    }

    //Give us us queue
    var q = 'helloQueue';

    //declare the queue in case it not exist
    ch.assertQueue(q, {durable: false});
    console.log(' [*] Waiting for messages in %s. To exit, press CTRL+C', q);
    ch.consume(q, function (msg) {
      console.log(' [*] Received %s', msg.content.toString());
    }, {noAck: true});

  });

});
