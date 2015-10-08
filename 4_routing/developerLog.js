require('../setup').Init('Routing Dev Log')
var amqp = require('amqp')
  connection = amqp.createConnection();
connection.on('ready', function () {
  var exchange = connection.exchange('logging.exchange', {type: 'topic'}),
    queue = connection.queue('developer.logging.queue');
  queue.on('queueDeclareOk', function (args) {
    queue.bind('logging.exchange', '*.log.ERROR');
    queue.on('queueBindOk', function () {
      queue.subscribe(function (message) {
        console.log(message.toString());
      });
    });
  });
});