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

  subscribeToTraderStatusUpdates(cb) {
    this.socket.on('trader.status', status => cb(status));
  }

  subscribeToPositionUpdates(cb) {
    this.socket.on('trader.position.update', content => cb(content));
  }
  
  getDefaultTraderConfig() {
    return axios.get(`${url}/api/getDefaultConfig`);
  }

  getTraderStatus() {
    return axios.get(`${url}/api/status`);
  }

  getProducts() {
    return axios.get(`${url}/api/products`);
  }

  getCurrencies() {
    return axios.get(`${url}/api/currencies`);
  }

  startTrader(config) {
    return axios.post(`${url}/api/start`, config);
  }

  stopTrader() {
    return axios.post(`${url}/api/stop`);
  }
}

export default TradeClient;