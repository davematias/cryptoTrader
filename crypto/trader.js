const strategyFactory = require('./strategies/strategyFactory');
const GDAX = require('gdax');
const colors = require('colors/safe');

class Trader {
  constructor(traderConfig) {
    this.publicClient = new GDAX.PublicClient();
    this.product = traderConfig.Product;
    this.status = 'stopped';

    this.strategy = strategyFactory.create(traderConfig.Strategy, {
      onBuySignal: (x) => { this.onBuySignal(x); },
      onSellSignal: (x) => { this.onSellSignal(x); }
    });
  }

  async start() {
    this.status = 'started';

    if (global.io) {
      global.io.emit('trader.status', 'started');
    }
  }

  stop() {
    this.status = 'stopped';

    if (global.io) {
      global.io.emit('trader.status', 'stopped');
    }
  }

  status() {
    return this.status;
  }

  async onBuySignal({ price, time }) { }

  async onSellSignal({ price, size, time, position }) { }

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
    if (global.io) {
      global.io.emit('trader.position.update', positionData);
    }
  }

  calcProfit(positionData) {
    const buyAmount = parseFloat(positionData.buyAmount);
    const buyfee = buyAmount * parseFloat(positionData.fee);
    const entranceAmount = (buyAmount-buyfee) / positionData.enter.price;

    if (positionData.exit) {
      const sellFee = entranceAmount * parseFloat(positionData.fee);
      return ((positionData.exit.price) * (entranceAmount - sellFee)) - buyAmount;
    } else {
      return 0;
    }
  }

  printPositionData(positionData) {
    const enter = `Enter | ${positionData.enter.price} | ${positionData.enter.time}`;
    const exit = positionData.exit ? `Exit: | ${positionData.exit.price} | ${positionData.exit.time}` :
      '';

    var profit = '';
    if (positionData.state === 'closed') {
      const prof = positionData.profit.toFixed(2);
      const colored = positionData.profit > 0 ? colors.green(prof) : colors.red(prof);
      profit = `Profit: ${colored}`;
    }

    console.log(`${enter} - ${exit} - ${profit}`)
  }

  printProfit() {
    const positions = this.strategy.getPositions();
    const total = positions.reduce((r, p) => {
      return r + this.calcProfit(p.getData());
    }, 0);

    const prof = `${total}`;
    const colored = total > 0 ? colors.green(prof) : colors.red(prof)
    console.log(`Total: ${colored}`);
  }
}

module.exports = Trader;