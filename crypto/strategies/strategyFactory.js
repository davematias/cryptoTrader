const Simple = require('./simpleStrategy')

exports.create = function(type, data) {
  switch (type) {
    default:
      return new Simple(data);
  }
};