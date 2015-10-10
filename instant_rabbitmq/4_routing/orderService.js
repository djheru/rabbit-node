var LoggingService = require('./loggingService'),
  logger = new LoggingService();

var OrderService = function OrderService(order) {

  this.order = order;

  this.checkout = function () {
    logger.log('Checkout', 'INFO', 'Placed order ' + this.order.orderId);
  };

  this.processOrder = function () {
    this.paymentGateway();
    this.updateStatus();
    logger.log('ProcessOrder', 'INFO', 'Thank you for placing your order');
    return this.status;
  };

  this.paymentGateway = function () {
    logger.log('PaymentGateway', 'INFO', 'Payment complete');
    this.status = 'OrderComplete';
  };

  this.updateStatus = function () {
    logger.log('UpdateStatus', 'INFO', 'Updated status');
  };

  this.updateInventory = function () {
    logger.log('UpdateInventory', 'INFO', 'Updated Inventory');
  };

  this.sendEmail = function () {
    logger.log('SendEmail', 'INFO', 'Sended Email');
  };

  this.updateReporting = function () {
    logger.log('UpdateReporting', 'INFO', 'Updated the reporting');
  };

  this.updateRecommendations = function () {
    console.log('updaterec')
    logger.log('updateRecommendations', 'INFO', 'Updated recommendations');
  };

};

module.exports = OrderService;
