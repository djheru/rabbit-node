'use strict';

const amqp = require('amqplib');

amqp.connect('amqp://localhost')
	.then((conn) => {
		process.once('SIGINT', () => { conn.close() });

		return conn.createChannel()
			.then((ch) => {
				const processMessage = (message) => {
					const item = JSON.parse(message.content.toString());

					console.log(
						' [X] Received msg: %s with priority %d',
						JSON.stringify(item, null, 2),
						item.priority
					);

					const processTime = Math.floor(Math.random() * 3) * 1000;
					// console.log(' [X] takes %d ms to process', processTime);
					setTimeout(() => {
						// console.log(' [X] Finished processing');
						ch.ack(message);
					}, processTime)
				}

				const queueName = 'priority_task_queue';
				let ok = ch.assertQueue(queueName, { durable: true, maxPriority: 10 });
				ok = ok.then(() => { ch.prefetch(1); });
				return ok.then(() => {
					ch.consume(queueName, processMessage, {noAck: false});
					console.log(' [x] Waiting for messages. CTRL-C to exit.');
				});

			})
			.catch(console.warn);
	})
	.catch(console.warn);