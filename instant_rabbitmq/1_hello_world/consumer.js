require('../setup').Init('Hello World');

var connect = require('amqp').createConnection();

connect.on('ready', function () {
  console.log('connection ready');

  var q = connect.queue('helloQueue');

  q.on('queueDeclareOk', function (args) {
    console.log('queueDeclareOk');

    q.bind('#');
    q.on('queueBindOk', function () {
      console.log('queueBindOk');

      q.subscribe(function (message) {
        console.log(message.data.toString());
      });

    });

  });

});
