#!/usr/bin/env node
const amqp = require('amqplib/callback_api');
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect('amqp://localhost', (err, conn) => {

  console.log('connect complete');
  if (err) {
    console.log('error: ', err);
    process.exit(1);
  }

  conn.createChannel((err, ch) => {
    console.log('create channel complete');
    if (err) {
      console.log('error: ', err);
      process.exit(1);
    }

    const ex = 'direct_logs';

    ch.assertExchange(ex, 'direct', {durable: false});

    //declare the queue in case it not exist
    ch.assertQueue('', {exclusive: true}, (err, q) => {
      console.log(' [*] Waiting for messages in %s. To exit, press CTRL+C', q);

      //listen for the severity levels specified in the args
      args.forEach((severity) => {
        ch.bindQueue(q.queue, ex, severity);
      });

      ch.consume(q.queue, (msg) => {
        //mock a time-consuming task by appending '.'s
        const secs = msg.content.toString().split('.').length;
        console.log(' [*] Received %s %s', msg.fields.routingKey, msg.content.toString());
      }, {noAck: false});
    });

  });

});
