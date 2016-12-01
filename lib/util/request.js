'use strict';

var rest = require('restler');
var Promise = require('bluebird');

function Request(taxjar) {
  this._taxjar = taxjar;
}

Request.prototype = {
  api: function(options) {
    var self = this;

    return new Promise(function(resolve, reject) {
      options.headers = options.headers || {};
      options.headers['Content-Type'] = 'application/json';

      rest[options.method](self._taxjar.getApiConfig('host') + options.url, {
        accessToken: self._taxjar.getApiConfig('key'),
        headers: options.headers,
        data: JSON.stringify(options.data),
        query: options.query
      }).on('complete', function(result) {
        if (result.error){
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }
};

module.exports = Request;
