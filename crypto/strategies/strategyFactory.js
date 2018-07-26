const Simple = require('./simpleStrategy')
const MACD = require('./simpleMACD')

exports.create = function(type, data) {
  switch (type) {
    case 'macd':
      return new MACD(data);
    default:
      return new Simple(data);
  }
};