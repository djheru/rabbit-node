require('../setup').Init('Work Queues');
var Order = require('./order'),
  OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection  =  amqp.createConnection();

var orderId = 0;

connection.on('ready', function () {
  //Add confirm: true to the options for Producer Confirms
  var exchange = connection.exchange('shop.exchange', {type: 'direct', confirm: true});
  //durable: true sets the message to persist if there is no consumer
  //autoDelete: true makes rabbit waits for ack from consumer before deleting
  var queue = connection.queue('shop.queue', {durable: true, autoDelete: false});

  queue.on('queueDeclareOk', function (args) {
    console.log('queueDeclareOk');

    queue.bind('shop.exchange', 'order.key');
    queue.on('queueBindOk', function () {
      console.log('queueBindOk');

      /*//send an order
      console.log('new order for checkout');
      var order = new Order(++orderId);
      var orderService = new OrderService(order);

      orderService.Checkout();
      exchange.publish('order.key', order, {deliveryMode: 2});*/

      //repeatedly send some orders
      setInterval(function () {
        console.log('new order for checkout');
        var order = new Order(++orderId);
        var orderService = new OrderService(order);

        orderService.ProcessOrder();
        //For publisher confirms, when publishing, give it an error callback
        exchange.publish('order.key', order, {deliveryMode: 2}, function (err) {
          if (err) {
            console.log('Error, Order not acknowledged! ', err);
          }
        });
      }, 1000);
    });
  });
});
