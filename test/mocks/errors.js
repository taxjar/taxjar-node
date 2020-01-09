'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const CATEGORY_ERROR_RES = {
  "message": "Unauthorized - Not authorized for route 'GET /v2/categories'",
  "error": "Unauthorized",
  "detail": "Not authorized for route 'GET /v2/categories'",
  "status": 401
};

const NEXUS_REGIONS_ERROR_RES = {
  name: 'RequestError',
  message: 'Error: Invalid URI "invalidApiUrl/v2/nexus/regions"'
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/categories')
  .reply(401, CATEGORY_ERROR_RES);

nock('invalidApiUrl')
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/nexus/regions')
  .replyWithError(NEXUS_REGIONS_ERROR_RES);

module.exports = {
  CATEGORY_ERROR_RES,
  NEXUS_REGIONS_ERROR_RES
};
