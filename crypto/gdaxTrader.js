const GDAX = require('gdax');

module.exports = class GDAXTrader {
    constructor() {
        this.publicClient = new GDAX.PublicClient();        
    }
    
    getCurrencies() {
        this.publicClient.getCurrencies().then(x => console.dir(x));        
    }

    getProducts() {
        this.publicClient.getProducts().then(x => console.dir(x));        
    }
}