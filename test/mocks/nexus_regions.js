'use strict';

var nock = require('nock');

var TEST_API_HOST = 'https://mockapi.taxjar.com';

var NEXUS_REGIONS_RES = {
  "regions": [
    {
      "country_code": "US",
      "country": "United States",
      "region_code": "CA",
      "region": "California"
    },
    {
      "country_code": "US",
      "country": "United States",
      "region_code": "NY",
      "region": "New York"
    },
    {
      "country_code": "US",
      "country": "United States",
      "region_code": "WA",
      "region": "Washington"
    }
  ]
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/nexus/regions')
  .reply(200, NEXUS_REGIONS_RES);

module.exports.NEXUS_REGIONS_RES = NEXUS_REGIONS_RES;