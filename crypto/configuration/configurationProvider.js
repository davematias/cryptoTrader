const fs = require('fs-extra');
const path = require('path');

async function getDefaultGdaxConfig() {
  const configPath = path.join(__dirname, 'gdax.config.json');

  if (fs.pathExistsSync(configPath)) {
    return fs.readJson(configPath);
  }

  return Promise.resolve({
    gdaxKey: '',
    gdaxSecret: '',
    passPhrase: '',
    TestFromDays: 10,
    TestInterval: 60,
    Product: 'BTC-EUR',
    Strategy: 'simple',
    Fee: 0.003,
    BuyAmount: 10,
  });
}

module.exports.getDefaultConfiguration = async () => {
  switch (process.env.Exchange) {
    default: return getDefaultGdaxConfig();
  }
};
