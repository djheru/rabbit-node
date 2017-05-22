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
    console.log(' [x] Sending "Hello World" to Queue');
    ch.sendToQueue(q, new Buffer('Hello World'));

    setTimeout(function () {
      conn.close();
      process.exit(0)
    }, 1000);

  });

});
