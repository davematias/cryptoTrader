require('dotenv').config();
const api = require('./express/api');
const traderManager = require('./crypto/traderManager');

if (process.env.Mode === 'standalone') {
  traderManager.getDefaultTraderConfig()
    .then((data) => {
      traderManager.startTrader(data);
    });
} else {
  global.io = api.init();
}
