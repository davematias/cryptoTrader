const GDAX = require('gdax');
const colors = require('colors/safe');
const PushBullet = require('pushbullet');

let pusher = null;
const pushEnabled = (process.env.pushbulletEnabled === 'true');

if (pushEnabled) {
  pusher = new PushBullet(process.env.pushbulletKey);
}

const strategyFactory = require('./strategies/strategyFactory');

class Trader {
  constructor(traderConfig) {
    this.startDate = null;
    this.publicClient = new GDAX.PublicClient();
    this.product = traderConfig.Product;
    this.interval = traderConfig.Interval;
    this.buyAmount = traderConfig.BuyAmount;
    this.fee = traderConfig.Fee;
    this.status = 'stopped';

    this.strategy = strategyFactory.create(traderConfig.Strategy, {
      onBuySignal: (x) => { this.onBuySignal(x); },
      onSellSignal: (x) => { this.onSellSignal(x); },
    });
  }

  async start() {
    console.log('Starting new session');
    this.status = 'started';
    this.startDate = new Date();

    if (global.io) {
      global.io.emit('trader.status', 'started');
    }
  }

  stop() {
    console.log('Session done');
    this.status = 'stopped';

    if (global.io) {
      global.io.emit('trader.status', 'stopped');
    }
  }

  getStatus() {
    return { status: this.status, timeStamp: this.startDate.getTime() };
  }

  onBuySignal(price) {
    if (pushEnabled) {
      const buyAmount = parseFloat(this.buyAmount);
      const buyfee = buyAmount * parseFloat(this.fee);
      const amount = (buyAmount - buyfee) / price;

      pusher.note({}, 'trader buy signal', `bougth: ${amount}`, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  onSellSignal(price) {
    if (pushEnabled) {
      const buyAmount = parseFloat(this.buyAmount);
      const buyfee = buyAmount * parseFloat(this.fee);
      const amount = (buyAmount - buyfee) / price;

      pusher.note({}, 'trader sell signal', `sold: ${amount}`, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  }

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
    const buyAmount = parseFloat(this.buyAmount);
    const buyfee = buyAmount * parseFloat(this.fee);
    const entranceAmount = (buyAmount - buyfee) / positionData.enter.price;

    if (positionData.exit) {
      const sellFee = entranceAmount * parseFloat(this.fee);
      return ((positionData.exit.price) * (entranceAmount - sellFee)) - buyAmount;
    }

    return 0;
  }

  printPositionData(positionData) {
    const enter = `Enter | ${positionData.enter.price} | ${positionData.enter.time.toLocaleString()}`;
    const exit = positionData.exit ? `Exit: | ${positionData.exit.price} | ${positionData.exit.timetoLocaleString()}`
      : '';

    let profit = '';
    if (positionData.state === 'closed') {
      const prof = positionData.profit.toFixed(2);
      const colored = positionData.profit > 0 ? colors.green(prof) : colors.red(prof);
      profit = `Profit: ${colored}`;
    }

    console.log(`${enter} - ${exit} - ${profit}`);
  }

  printProfit() {
    const positions = this.strategy.getPositions();
    const total = positions.reduce((r, p) => r + this.calcProfit(p.getData()), 0);

    const prof = `${total}`;
    const colored = total > 0 ? colors.green(prof) : colors.red(prof);
    console.log(`Total: ${colored}`);
  }
}

module.exports = Trader;
