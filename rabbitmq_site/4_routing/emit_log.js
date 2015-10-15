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
    var msg = process.argv.slice(2).join(' ') || 'Hello World';

    ch.assertExchange(ex, 'fanout', {durable: false});
    ch.publish(ex, '', new Buffer(msg));
    console.log(' [x] Sent: %s', msg);
  });

  setTimeout(function () { conn.close(); process.exit(0); }, 500);
});
