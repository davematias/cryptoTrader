require('dotenv').config();
const gdaxTrader = require('./crypto/gdaxTrader');
const TestTrader = require('./crypto/testTrader');
const api = require('./express/api')

//initialize our trader component and set it to a global variable
let trader;
if(process.env.Mode === 'test'){
    trader = new TestTrader();
} else {
    trader = new gdaxTrader();
}

trader.start();
global.trader = trader;
//initialize express server
//global.io = api.init();



