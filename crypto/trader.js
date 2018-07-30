const strategyFactory = require('./strategies/strategyFactory');
const GDAX = require('gdax');

class Trader {
  constructor(traderConfig) {
    this.publicClient = new GDAX.PublicClient();
    this.product = traderConfig.Product;

    this.strategy = strategyFactory.create(traderConfig.Strategy, {
      onBuySignal: (x) => { this.onBuySignal(x); },
      onSellSignal: (x) => { this.onSellSignal(x); }
    });
  }

  async start() {  }

  stop() {  }

  async onBuySignal({ price, time }) {  }

  async onSellSignal({ price, size, time, position }) {  }

  getCurrenciesPromise() {
    return this.publicClient.getCurrencies();
  }

  getProductsPromise() {
    return this.publicClient.getProducts();
  }

  getAccountsPromise() {
    return this.authenticatedClient.getAccounts();
  }

  sendPositionData(positionData) {
    if(global.io) {
      global.io.emit('position.update', positionData);
    }
  }
}

module.exports = Trader;