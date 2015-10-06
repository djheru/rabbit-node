require('../setup').Init('PubSub Update Recommendations');
var OrderService = require('./orderService'),
  amqp = require('amqp'),
  connection = amqp.createConnection();

connection.on('ready', function () {
  var exchange = connection.exchange('shop.fanout.exchange', {type: 'fanout'}),
    queue = connection.queue('shop.recommendations.queue');

  queue.on('queueDeclareOk', function (args) {
    queue.bind('shop.fanout.exchange', '');
    queue.on('queueBindOk', function () {
      console.log('queue bound ok?');
      queue.subscribe(function (message) {
        var orderService = new OrderService(message.data);
        console.log('update recomme')
        orderService.updateRecommendations();
      });
    });
  });
});
