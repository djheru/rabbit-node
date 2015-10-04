require('../setup').Init('Work Queues');
var Order = require('./order'),
  OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection  =  amqp.createConnection();

var orderId = 0;

connection.on('ready', function () {
  var exchange = connection.exchange('shop.exchange', {type: 'direct'});
  var queue = connection.queue('shop.queue');

  queue.on('queueDeclareOk', function (args) {
    console.log('queueDeclareOk');

    queue.bind('shop.exchange', 'order.key');
    queue.on('queueBindOk', function () {
      console.log('queueBindOk');

      //repeatedly send some orders
      setInterval(function () {
        console.log('new order for checkout');
        var order = new Order(++orderId);
        var orderService = new OrderService(order);

        orderService.Checkout();
        exchange.publish('order.key', order);
      });
    });
  });
});
