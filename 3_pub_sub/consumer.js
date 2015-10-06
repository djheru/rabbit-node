require('../setup').Init('PubSub Consumer');
var OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection = amqp.createConnection();

connection.on('ready', function () {
  var exchange = connection.exchange('shop.exchange', {type: 'direct', confirm: true}),
    queue = connection.queue('shop.queue', {durable: true, autoDelete: false});

  queue.on('queueDeclareOk', function (args) {
    queue.bind('shop.exchange', 'order.key');
    queue.on('queueBindOk', function () {
      queue.subscribe({ack: true}, function (message, headers, deliveryInfo, ack) {
        var orderService = new OrderService(message.data),
          status = orderService.processOrder();
        console.log('status -', status, '-');

        //After we get a message about an order, process it and then publish messages for the sub-tasks
        if (status == 'OrderComplete') {
          console.log('Order complete! Sending sub-tasks');
          var fanoutExchange = connection.exchange('shop.fanout.exchange', {type: 'fanout'});
          fanoutExchange.setMaxListeners(0);
          fanoutExchange.publish('', orderService.order);
        }
        //queue.shift();
        ack.acknowledge();
        console.log('Order processed, removing from queue');
      });
    });
  });
});
