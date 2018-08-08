const GDAX = require('gdax');
const GdaxTrader = require('./gdaxTrader');
const TestTrader = require('./testTrader');

const publicClient = new GDAX.PublicClient();

const defaultConfig = {
  Product: process.env.Product,
  Strategy: process.env.Strategy,
  Mode: process.env.Mode,
  FromDays: process.env.FromDays,
  Interval: process.env.Interval,
  Fee: process.env.Fee,
  BuyAmount: process.env.BuyAmount,
};

let trader;

module.exports.startTrader = (traderConfig) => {
  if (traderConfig.Mode === 'test') {
    trader = new TestTrader(traderConfig);
  } else {
    trader = new GdaxTrader(traderConfig);
  }

  trader.start();
};

module.exports.stopTrader = () => {
  if (trader) {
    trader.stop();
  }

  throw new Error('Please start a trader first');
};

module.exports.getTraderStatus = () => {
  if (trader) {
    return trader.getStatus();
  }

  return {status: 'stopped'};
};

module.exports.getDefaultTraderConfig = () => defaultConfig;

module.exports.getCurrenciesPromise = () => publicClient.getCurrencies();

module.exports.getProductsPromise = () => publicClient.getProducts();

// module.exports.getAccountsPromise = () => authenticatedClient.getAccounts();
