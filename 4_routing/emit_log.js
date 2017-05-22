#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

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

    const ex = 'direct_logs';

    console.log(process.argv);
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World';
    const severity = (args.length > 0) ? args[0] : 'info';

    ch.assertExchange(ex, 'direct', {durable: false});
    ch.publish(ex, severity, new Buffer(msg));
    console.log(' [x] Sent: %s', msg);
  });

  setTimeout(function () { conn.close(); process.exit(0); }, 500);
});
