import axios from 'axios';
import io from 'socket.io-client';

const url = "http://localhost:5000";

class TradeClient {
  constructor(){
    this.socket = io(url);
  }

  subscribeToDataUpdates(cb) {
    this.socket.on('data', content => cb(content));
  }

  getProducts() {
    return axios.get(`${url}/api/products`);
  }

  getCurrencies() {
    return axios.get(`${url}/api/currencies`);
  }
}

export default TradeClient;