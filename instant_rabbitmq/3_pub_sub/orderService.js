var OrderService = function OrderService(order) {

  this.order = order;

  console.log('Order: ', this.order);

  this.checkout = function () {
    console.log('checkout Order: ' + this.order);
  };

  this.processOrder = function () {
    this.paymentGateway();
    this.updateStatus();
    console.log('processOrder status: ' + this.status);
    return this.status;
  };

  this.paymentGateway = function () {
    console.log('paymentGateway');
    this.status = 'OrderComplete';
  };

  this.updateStatus = function () {
    console.log('updateStatus');
  };

  this.updateInventory = function () {
    console.log('updateInventory');
  };

  this.sendEmail = function () {
    console.log('sendEmail');
  };

  this.updateReporting = function () {
    console.log('updateReporting');
  };

  this.updateRecommendations = function () {
    console.log('updateRecommendations');
  };

};

module.exports = OrderService;