'use strict';

var Request = require('./util/request');

function Taxjar(key) {
  if (!(this instanceof Taxjar)) {
    return new Taxjar(key);
  }

  this._api = {
    host: 'https://api.taxjar.com'
  }

  this.setApiConfig('key', key);
  this.request = new Request(this);
}

Taxjar.prototype = {

  getApiConfig: function(index) {
    return this._api[index];
  },

  setApiConfig: function(index, value) {
    this._api[index] = value;
  },

  categories: function() {
    return this.request.api({
      method: 'get',
      url: '/v2/categories'
    });
  },

  ratesForLocation: function(zip, params) {
    return this.request.api({
      method: 'get',
      url: '/v2/rates/' + zip,
      data: params
    });
  },

  taxForOrder: function(params) {
    return this.request.api({
      method: 'get',
      url: '/v2/taxes',
      data: params
    });
  },

  createOrder: function(params) {
    return this.request.api({
      method: 'post',
      url: '/v2/transactions/orders',
      data: params
    });
  },

  updateOrder: function(transactionId, params) {
    return this.request.api({
      method: 'post',
      url: '/v2/transactions/orders/' + transactionId,
      data: params
    });
  },

  createRefund: function(params) {
    return this.request.api({
      method: 'post',
      url: '/v2/transactions/refunds',
      data: params
    });
  },


  updateRefund: function(transactionId, params) {
    return this.request.api({
      method: 'post',
      url: '/v2/transactions/refunds/' + transactionId,
      data: params
    });
  },

};

module.exports = Taxjar;