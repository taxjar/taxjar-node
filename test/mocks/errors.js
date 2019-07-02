'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const CATEGORY_ERROR_RES = {
  "message": "TaxJar: Unauthorized - Not authorized for route 'GET /v2/categories'",
  "error": "Unauthorized",
  "detail": "Not authorized for route 'GET /v2/categories'",
  "status": 401
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/categories')
  .reply(401, CATEGORY_ERROR_RES);

module.exports.CATEGORY_ERROR_RES = CATEGORY_ERROR_RES;
