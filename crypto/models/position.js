const colors = require('colors/safe')

class Position {
  constructor({ trade, id }) {
    this.state = 'open'
    this.enter = trade
    this.id = id
  }

  close({ trade }) {
    this.state = 'closed'
    this.exit = trade
  }

  print() {
    const enter = `Enter | ${this.enter.price} | ${this.enter.time}`
    const exit = this.exit ? `Exit: | ${this.exit.price} | ${this.exit.time}` :
      ''

    var profit = ''
    if (this.state === 'closed') {
      const prof = `${this.profitString()}`
      const colored = this.profit() > 0 ? colors.green(prof) : colors.red(prof)
      profit = `Profit: ${colored}`
    }

    console.log(`${enter} - ${exit} - ${profit}`)
  }

  profit() {            
    const buyAmount = parseFloat(process.env.BuyAmount);
    const buyfee = buyAmount * parseFloat(process.env.Fee);
    const entranceBtcAmount = (buyAmount-buyfee) / this.enter.price;
        
    if (this.exit) {
      const sellFee = entranceBtcAmount * parseFloat(process.env.Fee);    
      return ((this.exit.price) * (entranceBtcAmount - sellFee)) - buyAmount;
    } else {
      return 0;
    }
  }

  profitString() {
    return this.profit().toFixed(2)
  }
}

module.exports = Position