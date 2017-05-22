const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'rpc_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, (msg) => {
      const n = parseInt(msg.content.toString());

      console.log(" [.] Request: %s fib(%d)", msg.properties.correlationId, n);

      const r = fibonacci(n);
      console.log('Answer:', r);
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(r.toString()),
        {correlationId: msg.properties.correlationId});

      ch.ack(msg);
    });
  });
});

const fibonacci = (n) => (n == 0 || n == 1) ? n : fibonacci(n - 1) + fibonacci(n - 2);