const GDAX = require('gdax');
const gdaxKey = process.env.gdaxKey;
const gdaxSecret = process.env.gdaxSecret;
const passPhrase = process.env.passPhrase;
const apiURI = 'https://api.gdax.com';
const CURRENCIES = ['BTC-USD', 'ETH-BTC', 'ETH-USD'];

module.exports = class GDAXTrader {
  constructor() {
    this.publicClient = new GDAX.PublicClient();
    //this.authenticatedClient = new GDAX.AuthenticatedClient(gdaxKey, gdaxSecret, passPhrase, apiURI);
    this.websocket = new GDAX.WebsocketClient(CURRENCIES);

    this.SocketListener = (data) => {
      if (!(data.type === 'done' && data.reason === 'filled')) {
        return;
      }

      //if there is a global websocket
      if(global.io) {
        global.io.emit('data', data);
      }

      console.dir(data);
    };

    this.websocket.addListener("message", this.SocketListener);
  }

  getCurrenciesPromise() {
    return this.publicClient.getCurrencies();
  }

  getProductsPromise() {
    return this.publicClient.getProducts();
  }


  getAccountsPromise() {
    return this.authenticatedClient.getAccounts();
  }

  buy(buyData) {
    const buyParams = {
        'price': buyData.price,
        'size': buyData.size,
        'product_id': buyData.product_id,
    };

    return authedClient.buy(buyParams, callback);
  }

  sell(buyData) {
    const sellParams = {
        'price': buyData.price,
        'size': buyData.size,
        'product_id': buyData.product_id
    };

    return authedClient.sell(sellParams,  callback);
  }
}