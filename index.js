require('dotenv').config();
const gdaxTrader = require('./crypto/gdaxTrader');
const TestTrader = require('./crypto/testTrader');
const api = require('./express/api')

global.io = api.init();