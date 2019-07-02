'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const RATE_RES = {
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

const LA_RATE_RES = {
  "rate": Object.assign({}, RATE_RES.rate, {"city": "LOS ANGELES"})
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/rates/' + RATE_RES.rate.zip)
  .query(true)
  .reply(200, RATE_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/rates/' + RATE_RES.rate.zip)
  .query({
    city: 'Los Angeles',
    country: 'US'
  })
  .reply(200, LA_RATE_RES);

module.exports = {
  RATE_RES: RATE_RES,
  LA_RATE_RES: LA_RATE_RES
};
