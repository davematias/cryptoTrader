const HistoricalService = require('./historicalService');
const randomstring = require('randomstring');
const Trader = require('./trader');

class TestTrader extends Trader {
    constructor(traderConfig){
        super(traderConfig);

        let date = new Date();
        date.setDate(date.getDate()-traderConfig.FromDays);
        this.startTime = date;
        this.endTime = new Date();
        this.interval = traderConfig.Interval;
        this.buyAmount = traderConfig.BuyAmount;
        this.fee = traderConfig.Fee;
        this.stopTask = false;

        this.historical = new HistoricalService({
          start: this.startTime,
          end: this.endTime,
          interval: this.interval,
          product: this.product
        });
    }

    async start() {
        super.start();
        this.stopTask = false;

        try {
          const history = await this.historical.getData();

          if(this.stopTask) {
            return;
          }

          await Promise.all(history.map((stick, index) => {
            const sticks = history.slice(0, index + 1)
            return this.strategy.run({
              sticks, time: stick.startTime
            })
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

    sendAllPositions() {
      const positions = this.strategy.getPositions();
      positions.forEach((p) => {
       let data = p.getData();
       data.profit = this.calcProfit(data);
       this.sendPositionData(data);
       this.printPositionData(data);
      });
    }

    async onBuySignal({ price, time }) {
      const id = randomstring.generate(20)
      this.strategy.positionOpened({
        price, time, size: process.env.BuyAmount, id
      });
    }

    async onSellSignal({ price, size, time, position }) {
      this.strategy.positionClosed({
        price, time, size, id: position.id
      });
    }
}

module.exports = TestTrader;