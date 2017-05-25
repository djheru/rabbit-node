'use strict';

const amqp = require('amqplib');
const workItemFactory = require('./work_items');

const args = process.argv.slice(2);
const numItems = (args.length > 0) ? parseInt(args[0], 10) : 100;
const workItems = workItemFactory(numItems);

amqp.connect('amqp://localhost')
	.then((conn) => {
		return conn.createChannel()
			.then((ch) => {
				const queueName = 'priority_task_queue';
				const ok = ch.assertQueue(queueName, { durable: true, maxPriority: 10 });
				return ok.then(() => {

					workItems.forEach(item => {
						const queueOptions = { priority: item.priority, persistent: true };
						const msg = JSON.stringify(item);
						ch.sendToQueue(queueName, new Buffer(msg), queueOptions);
						console.log(' [x] sent item to queue: %s', msg);
					});

					return ch.close();
				})
				.catch(console.warn);
			})
			.finally(() => {
				console.log(' [X] All items sent to queue');
				conn.close()
			});
	}).catch(console.warn);