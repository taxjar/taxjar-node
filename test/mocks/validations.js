'use strict';

var nock = require('nock');

var TEST_API_HOST = 'https://mockapi.taxjar.com';

var VALIDATION_RES = {
  "validation": {
    "valid": true,
    "exists": true,
    "vies_available": true,
    "vies_response": {
      "country_code": "FR",
      "vat_number": "40303265045",
      "request_date": "2016-02-10",
      "valid": true,
      "name": "SA SODIMAS",
      "address": "11 RUE AMPERE\n26600 PONT DE L ISERE"
    }
  }
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/validation')
  .query({
    vat: 'FR40303265045'
  })
  .reply(200, function(uri, body) {
    return VALIDATION_RES;
  });

module.exports.VALIDATION_RES = VALIDATION_RES;