const GDAX = require('gdax');

const publicClient = new GDAX.PublicClient();

module.exports.getCurrencies = () => publicClient.getCurrencies();

module.exports.getProducts = () => publicClient.getProducts();
