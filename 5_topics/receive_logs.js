#!/usr/bin/env node
const amqp = require('amqplib/callback_api');
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
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

    const ex = 'topic_logs';

    ch.assertExchange(ex, 'topic', {durable: false});

    //declare the queue in case it not exist
    ch.assertQueue('', {exclusive: true}, (err, q) => {
      console.log(' [*] Waiting for messages in %s. To exit, press CTRL+C', JSON.stringify(q));

      //listen for the severity levels specified in the args
      args.forEach((key) => {
        ch.bindQueue(q.queue, ex, key);
      });

      ch.consume(q.queue, (msg) => {
        console.log(' [*] Received %s %s', msg.fields.routingKey, msg.content.toString());
      }, {noAck: false});
    });

  });

});
