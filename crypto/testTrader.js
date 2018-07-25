const HistoricalService = require('./historicalService');
const SimpleStrategy = require('./strategies/simpleStrategy');
const randomstring = require('randomstring');
const colors = require('colors/safe')

class TestTrader {
    constructor(){
        let date = new Date();
        date.setDate(date.getDate()-process.env.FromDays);
        this.startTime = date;
        this.endTime = new Date();
        this.interval = process.env.Interval;
        this.product = process.env.Product;

        if(process.env.Strategy === "simple") {
          this.strategy = new SimpleStrategy({
            onBuySignal: (x) => { this.onBuySignal(x) },
            onSellSignal: (x) => { this.onSellSignal(x) }
          });
        }

        this.historical = new HistoricalService({
          start: this.startTime,
          end: this.endTime,
          interval: this.interval,
          product: this.product
        });
    }

    async start() {
        try {
          const history = await this.historical.getData();
          
          await Promise.all(history.map((stick, index) => {
            const sticks = history.slice(0, index + 1)
            return this.strategy.run({
              sticks, time: stick.startTime
            })
          }));

          this.printPositions();
          this.printProfit();
                  
        } catch (error) {
          console.log(error)
        }
    }

    printPositions() {
      const positions = this.strategy.getPositions()
      positions.forEach((p) => {
        p.print()
      })
    }
  
    printProfit() {
      const positions = this.strategy.getPositions()
      const total = positions.reduce((r, p) => {
        return r + p.profit()
      }, 0)
  
      const prof = `${total}`
      const colored = total > 0 ? colors.green(prof) : colors.red(prof)
      console.log(`Total: ${colored}`)
    }

    async onBuySignal({ price, time }) {
      const id = randomstring.generate(20)
      this.strategy.positionOpened({
        price, time, size: process.env.BuyAmount, id
      })
    }
  
    async onSellSignal({ price, size, time, position }) {
      this.strategy.positionClosed({
        price, time, size, id: position.id
      })
    }
}

module.exports = TestTrader;