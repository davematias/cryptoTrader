const randomstring = require('randomstring');
const HistoricalService = require('./services/gdaxHistoricalService');
const Trader = require('./trader');

class GdaxTestTrader extends Trader {
  constructor(traderConfig) {
    super(traderConfig);

    this.interval = traderConfig.TestInterval;
    const date = new Date();
    date.setDate(date.getDate() - traderConfig.TestFromDays);
    this.startTime = date;
    this.endTime = new Date();
    this.stopTask = false;

    this.historical = new HistoricalService({
      start: this.startTime,
      end: this.endTime,
      interval: this.interval,
      product: this.product,
    });
  }

  async start() {
    super.start();
    this.stopTask = false;

    try {
      const history = await this.historical.getData();

      if (this.stopTask) {
        return;
      }

      await Promise.all(history.map((stick, index) => {
        const sticks = history.slice(0, index + 1);
        return this.strategy.run({
          sticks, time: stick.startTime,
        });
      }));

      this.sendAllPositions();
      this.printProfit();
      super.stop();
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    this.stopTask = true;
    super.stop();
  }

  getStatus() {
    const positions = this.strategy.getPositions().map((p) => {
      const data = p.getData();
      data.profit = this.calcProfit(data);
      return data;
    });

    return {
      status: this.status,
      timeStamp: this.startDate.getTime(),
      positions,
    };
  }

  sendAllPositions() {
    const positions = this.strategy.getPositions();
    positions.forEach((p) => {
      const data = p.getData();
      data.profit = this.calcProfit(data);
      Trader.sendPositionData(data);
      Trader.printPositionData(data);
    });
  }

  async onBuySignal({ price, time }) {
    const id = randomstring.generate(20);
    this.strategy.positionOpened({
      price, time, size: process.env.BuyAmount, id,
    });

    super.onBuySignal(price);
  }

  async onSellSignal({
    price, size, time, position,
  }) {
    this.strategy.positionClosed({
      price, time, size, id: position.id,
    });

    super.onBuySignal(price);
  }
}

module.exports = GdaxTestTrader;
