const gdaxTrader = require('./gdaxTrader');
const TestTrader = require('./testTrader');
const GDAX = require('gdax');
const publicClient = new GDAX.PublicClient();

let defaultConfig = {
  Product: process.env.Product,
  Strategy: process.env.Strategy,
  Mode: process.env.Mode,
  FromDays: process.env.FromDays,
  Interval: process.env.Interval,
  Fee: process.env.Fee,
  BuyAmount: process.env.BuyAmount
};

let trader;

module.exports.startTrader = function(traderConfig) {
    if(traderConfig.Mode === 'test'){
        trader = new TestTrader(traderConfig);
    } else {
        trader = new gdaxTrader(traderConfig);
    }

    trader.start();
}

module.exports.stopTrader = function() {
    if(trader){
        trader.stop();
    }

    throw new Error("Please start a trader first");
}

module.exports.getTraderStatus = function() {
  if(trader){
    return trader.status();
  }

  return "stoped";
}

module.exports.getDefaultTraderConfig = function() {
    return defaultConfig;
}

module.exports.getCurrenciesPromise = function() {
    return publicClient.getCurrencies();
}

module.exports.getProductsPromise = function() {
    return publicClient.getProducts();
}

module.exports.getAccountsPromise = function() {
    return authenticatedClient.getAccounts();
}