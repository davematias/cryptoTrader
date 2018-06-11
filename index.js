const gdaxTrader = require('./crypto/gdaxTrader');
const api = require('./express/api')

const trader = new gdaxTrader();
trader.getCurrenciesPromise().then(x => console.dir(x));

//initialize express server
api.init();

