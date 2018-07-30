const HistoricalService = require('./historicalService');
const strategyFactory = require('./strategies/strategyFactory');
const randomstring = require('randomstring');
const colors = require('colors/safe');
const Trader = require('./trader')

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

          //this.printPositions();
          //this.printProfit();
          this.sendAllPositions();

        } catch (error) {
          console.log(error);
        }
    }

    stop() {
      this.stopTask = true;
    }

    sendAllPositions() {
      const positions = this.strategy.getPositions();
      positions.forEach((p) => {
       let data = p.getData();
       data.profit = this.calcProfit(data);
       this.sendPositionData(p.getData());
      });
    }

    calcProfit(positionData) {
      const buyAmount = parseFloat(this.buyAmount);
      const buyfee = buyAmount * parseFloat(this.fee);
      const entranceAmount = (buyAmount-buyfee) / positionData.enter.price;
  
      if (this.exit) {
        const sellFee = entranceAmount * parseFloat(this.fee);
        return ((positionData.exit.price) * (entranceAmount - sellFee)) - buyAmount;
      } else {
        return 0;
      }
    }

    /* printPositions() {
      const positions = this.strategy.getPositions();
      positions.forEach((p) => {
        p.print();
      });
    }

    printProfit() {
      const positions = this.strategy.getPositions();
      const total = positions.reduce((r, p) => {
        return r + p.profit();
      }, 0);

      const prof = `${total}`;
      const colored = total > 0 ? colors.green(prof) : colors.red(prof)
      console.log(`Total: ${colored}`);
    } */

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