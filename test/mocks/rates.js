'use strict';

var nock = require('nock');

var TEST_API_HOST = 'https://mockapi.taxjar.com';

var RATE_RES = {
  "rate": {
    "zip": "90002",
    "state": "CA",
    "state_rate": "0.065",
    "county": "LOS ANGELES",
    "county_rate": "0.01",
    "city": "WATTS",
    "city_rate": "0.0",
    "combined_district_rate": "0.015",
    "combined_rate": "0.09"
  }
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/rates/' + RATE_RES.rate.zip)
  .reply(200, function(uri, body) {
    return RATE_RES;
  });

module.exports.RATE_RES = RATE_RES;