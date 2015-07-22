'use strict';

var rest = require('restler');
var Promise = require('bluebird');

function Request(taxjar) {
  this._taxjar = taxjar;
}

Request.prototype = {

  api: function(options) {
    var defer = Promise.defer();

    rest[options.method](this._taxjar.getApiConfig('host') + options.url, {
      accessToken: this._taxjar.getApiConfig('key'),
      headers: options.headers,
      data: options.data || {}
    }).on('complete', function(result) {
      if (result instanceof Error) {
        defer.reject(result);
      } else {
        defer.resolve(result);
      }
    });

    return defer.promise;
  }

};

module.exports = Request;