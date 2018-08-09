const randomstring = require('randomstring');
const HistoricalService = require('./historicalService');
const Trader = require('./trader');

class TestTrader extends Trader {
  constructor(traderConfig) {
    super(traderConfig);

    const date = new Date();
    date.setDate(date.getDate() - traderConfig.FromDays);
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
      this.sendPositionData(data);
      this.printPositionData(data);
    });
  }

  async onBuySignal({ price, time }) {
    console.log('Buy');
    const id = randomstring.generate(20);
    this.strategy.positionOpened({
      price, time, size: process.env.BuyAmount, id,
    });

    super.onBuySignal(price);
  }

  async onSellSignal({
    price, size, time, position,
  }) {
    console.log('Sell');
    this.strategy.positionClosed({
      price, time, size, id: position.id,
    });

    super.onBuySignal(price);
  }
}

module.exports = TestTrader;
