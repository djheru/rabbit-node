require('../setup').Init('PubSub Send Email');
var OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection = amqp.createConnection();

connection.on('ready', function () {
  var exchange = connection.exchange('shop.fanout.exchange', {type: 'fanout'}),
    queue = connection.queue('shop.email.queue');

  queue.on('queueDeclareOk', function (args) {
    queue.bind('shop.fanout.exchange', '');
    queue.on('queueBindOk', function () {
      queue.subscribe(function (message) {
        var orderService = new OrderService(message);
        orderService.sendEmail();
      });
    });
  });
});
