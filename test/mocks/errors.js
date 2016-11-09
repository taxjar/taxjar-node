'use strict';

var nock = require('nock');

var TEST_API_HOST = 'https://mockapi.taxjar.com';

var CATEGORY_ERROR_RES = {
  "error": "Unauthorized",
  "detail": "Not authorized for route 'GET /v2/categories'",
  "status": 401
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/categories')
  .reply(401, CATEGORY_ERROR_RES);

module.exports.CATEGORY_ERROR_RES = CATEGORY_ERROR_RES;