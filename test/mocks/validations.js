'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const ADDRESS_VALIDATION_RES = {
  "addresses": [
    {
      "zip": "85297-2176",
      "street": "3301 S Greenfield Rd",
      "state": "AZ",
      "country": "US",
      "city": "Gilbert"
    }
  ]
};

const VALIDATION_RES = {
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
  .post('/v2/addresses/validate', {
    country: 'US',
    state: 'AZ',
    zip: '85297',
    city: 'Gilbert',
    street: '3301 South Greenfield Rd'
  })
  .reply(200, ADDRESS_VALIDATION_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/validation')
  .query({
    vat: 'FR40303265045'
  })
  .reply(200, VALIDATION_RES);

module.exports.ADDRESS_VALIDATION_RES = ADDRESS_VALIDATION_RES;
module.exports.VALIDATION_RES = VALIDATION_RES;
