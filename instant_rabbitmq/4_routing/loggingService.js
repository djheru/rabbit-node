module.exports = function loggingService() {
  this.log = function (location, level, message) {
    var amqp = require('amqp'),
      connection = amqp.createConnection(),
      logType = location + '.log.' + level;
    connection.on('ready', function () {
      var exchange = connection.exchange('logging.exchange', {type: 'topic', confirm: true});
      exchange.publish(logType, message)
    });
  };
};
