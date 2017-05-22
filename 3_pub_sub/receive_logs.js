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

    var ex = 'logs';

    ch.assertExchange(ex, 'fanout', {durable: false});

    //declare the queue in case it not exist
    ch.assertQueue('', {exclusive: true}, function (err, q) {
      console.log(' [*] Waiting for messages in %s. To exit, press CTRL+C', JSON.stringify(q));
      ch.bindQueue(q.queue, ex, '');
      ch.consume(q.queue, function (msg) {
        //mock a time-consuming task by appending '.'s
        var secs = msg.content.toString().split('.').length;
        console.log(' [*] Received %s', msg.content.toString());
      }, {noAck: false});
    });

  });

});
