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
    var q = 'workQueue';

    //declare the queue in case it not exist
    ch.assertQueue(q, {durable: true});
    //Prefetch allows the broker to distribute messages based on how busy they are
    //It won't dispatch the message till a worker has processed and acknowleged the previous one
    //Sending it to the next free worker
    console.log(' [*] Waiting for messages in %s. To exit, press CTRL+C', q);
    ch.consume(q, function (msg) {
      //mock a time-consuming task by appending '.'s
      var secs = msg.content.toString().split('.').length;
      console.log(' [*] Received %s', msg.content.toString());

      setTimeout(function() {
        console.log(' [*] Task Completed');
        ch.ack(msg);
      }, secs * 1000);
    }, {noAck: false});

  });

});
