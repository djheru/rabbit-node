require('../setup').Init('PubSub Producer');
var Order = require('./order'),
  OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection  =  amqp.createConnection();

var orderId = 0;

connection.on('ready', function () {
  //Add confirm: true to the options for Producer Confirms
  var exchange = connection.exchange('shop.exchange', {type: 'direct', confirm: true});
  //repeatedly send some orders
  setInterval(function () {
    var order = new Order(++orderId);
    var orderService = new OrderService(order);

    orderService.checkout();
    //For publisher confirms, when publishing, give it an error callback
    console.log('publishing order: ', order);
    exchange.publish('order.key', order, {deliveryMode: 2}, function (err) {
      if (err) {
        console.log('Error, Order not acknowledged! ', err);
      }
    });
  }, 1000);
});
