'use strict';

var nock = require('nock');

var TEST_API_HOST = 'https://mockapi.taxjar.com';

var SUMMARY_RATES_RES = {
  "summary_rates": [
    {
      "country_code": "US",
      "country": "United States",
      "region_code": "CA",
      "region": "California",
      "minimum_rate": {
        "label": "State Tax",
        "rate": 0.065
      },
      "average_rate": {
        "label": "Tax",
        "rate": 0.0827
      }
    },
    {
      "country_code": "CA",
      "country": "Canada",
      "region_code": "BC",
      "region": "British Columbia",
      "minimum_rate": {
        "label": "GST",
        "rate": 0.05
      },
      "average_rate": {
        "label": "PST",
        "rate": 0.12
      }
    },
    {
      "country_code": "UK",
      "country": "United Kingdom",
      "region_code": null,
      "region": null,
      "minimum_rate": {
        "label": "VAT",
        "rate": 0.2
      },
      "average_rate": {
        "label": "VAT",
        "rate": 0.2
      }
    }
  ]
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/summary_rates')
  .reply(200, function(uri, body) {
    return SUMMARY_RATES_RES;
  });

module.exports.SUMMARY_RATES_RES = SUMMARY_RATES_RES;