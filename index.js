require('dotenv').config();
const gdaxTrader = require('./crypto/gdaxTrader');
const api = require('./express/api')

//initialize our trader component and set it to a global variable
global.trader = new gdaxTrader();

//initialize express server
global.io = api.init();



