require('dotenv').config();
const api = require('./express/api');

global.io = api.init();