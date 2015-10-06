require('../setup').Init('Work Queues');
var OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection = amqp.createConnection();

connection.on('ready', function () {
  //Add confirm: true to the options for Producer Confirms
  var exchange = connection.exchange('shop.exchange', {type: 'direct', confirm: true}),
  //durable: true sets the message to persist if there is no consumer
  //autoDelete: true makes rabbit waits for ack from consumer before deleting
    queue = connection.queue('shop.queue', {durable: true, autoDelete: false});

  queue.on('queueDeclareOk', function (args) {
    console.log('queueDeclareOk');

    queue.bind('shop.exchange', 'order.key');
    queue.on('queueBindOk', function () {
      console.log('queueBindOk');

      //ack: true sends an acknowledgement when the message is received
      queue.subscribe({ack: true}, function (message, headers, deliveryInfo, messageObject) {
        console.log('subscribe', message);//, headers, deliveryInfo, messageObject);//
        var orderService = new OrderService(message.data);
        orderService.processOrder();
        queue.shift();
        console.log('Remove order from queue.');
      });

    });

  });
});
