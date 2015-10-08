require('../setup').Init('Hello World');
var connect = require('amqp').createConnection();
var messages = [
  ' |\\ /|',
  ' (\'.\') -> hello world',
  '(") (")'
];

connect.on('ready', function () {
  console.log('connection ready');

  var ex = connect.exchange();
  messages.forEach(function (message) {
    console.log('publishing message: ', message);
    ex.publish('helloQueue', message, {});
  });

});
