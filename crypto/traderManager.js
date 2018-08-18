const GdaxTestTrader = require('./gdaxTestTrader');
const gdaxAccountService = require('./services/gdaxAccountService');
const configProvider = require('./configuration/configurationProvider');


let trader;

module.exports.startTrader = (traderConfig) => {
  switch (traderConfig.Trader) {
    default: trader = new GdaxTestTrader(traderConfig);
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

  return { status: 'stopped' };
};

module.exports.getDefaultTraderConfig = async () => configProvider.getDefaultConfiguration();

module.exports.getCurrencies = async () => {
  switch (process.env.Exchange === 'gdax') {
    default: return gdaxAccountService.getCurrencies();
  }
};

module.exports.getProducts = async () => {
  switch (process.env.Exchange === 'gdax') {
    default: return gdaxAccountService.getProducts();
  }
};
