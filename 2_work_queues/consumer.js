require('../setup').Init('Work Queues');
var OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection = amqp.createConnection();

connection.on('ready', function () {
  var exchange = connection.exchange('shop.exchange', {type: 'direct'}),
    queue = connection.queue('shop.queue', {durable: true});
  queue.on('queueDeclareOk', function (args) {
    console.log('queueDeclareOk');

    queue.bind('shop.exchange', 'order.key');
    queue.on('queueBindOk', function () {
      console.log('queueBindOk');

      queue.subscribe(function (message) {
        console.log('subscribe');
        var orderService = new OrderService(message.data);
        orderService.ProcessOrder();
      });

    });

  });
});
