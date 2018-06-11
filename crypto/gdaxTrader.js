const GDAX = require('gdax');
const gdaxKey = "INSERT_YOUR_GDAX_KEY";
const gdaxSecret = "INSERT_YOUR_GDAX_SECRET";
const passPhrase = "INSERT_YOUR_GDAX_PASSPHRASE";
const apiURI = 'https://api.gdax.com';
const BTC_USD = ['BTC-USD'];

module.exports = class GDAXTrader {
  constructor() {
    this.publicClient = new GDAX.PublicClient();
    //this.authenticatedClient = new GDAX.AuthenticatedClient(gdaxKey, gdaxSecret, passPhrase, apiURI);
    this.websocket = new GDAX.WebsocketClient(BTC_USD);

    this.SocketListener = (data) => {
      if (!(data.type === 'done' && data.reason === 'filled')) {
        return;
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

  getProductHistoricalRatesPromise(currencyA, currencyB, granularity) {
    return this.publicClient.getProductHistoricRates(`${currencyA}-${currencyB}`, { granularity });
  }

  getAccountsPromise() {
    return this.authenticatedClient.getAccounts();
  }

  Buy(buyData) {
    const buyParams = {
        'price': buyData.price,
        'size': buyData.size,
        'product_id': BTC_USD,
    };
    this.buyOrderId = authedClient.buy(buyParams, callback);
  }

  placeSell(buyData) {
    const sellParams = {
        'price': buyData.price,
        'size': buyData.size,
        'product_id': BTC_USD
    };
    this.sellOrderId = authedClient.sell(sellParams,  callback);
  }
}