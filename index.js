const gdaxTrader = require('./crypto/gdaxTrader');
const api = require('./express/api')

const trader = new gdaxTrader();
trader.getCurrencies();

//initialize express server
api.init();

