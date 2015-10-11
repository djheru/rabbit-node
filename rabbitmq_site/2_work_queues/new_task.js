#!/usr/bin/env node
var amqp = require('amqplib/callback_api'),
  msg = process.argv.slice(2).join(' ') || 'Hello World';

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
    console.log(' [x] Sending "%s" to Queue', msg);
    ch.sendToQueue(q, new Buffer(msg), {persistent: true});

    setTimeout(function () {
      conn.close();
      process.exit(0)
    }, 1000);

  });

});
