'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const LIST_CUSTOMER_RES = {
  "customers": [
    "123",
    "456"
  ]
};

const SHOW_CUSTOMER_RES = {
  "customer": {
    "customer_id": "123",
    "exemption_type": "wholesale",
    "exempt_regions": [
      {
        "country": "US",
        "state": "FL"
      },
      {
        "country": "US",
        "state": "PA"
      }
    ],
    "name": "Dunder Mifflin Paper Company",
    "country": "US",
    "state": "PA",
    "zip": "18504",
    "city": "Scranton",
    "street": "1725 Slough Avenue"
  }
};

const CREATE_CUSTOMER_RES = SHOW_CUSTOMER_RES;
const UPDATE_CUSTOMER_RES = SHOW_CUSTOMER_RES;
const DELETE_CUSTOMER_RES = SHOW_CUSTOMER_RES;

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/customers')
  .query(true)
  .reply(200, LIST_CUSTOMER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/customers/' + SHOW_CUSTOMER_RES.customer.customer_id)
  .reply(200, SHOW_CUSTOMER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .matchHeader('content-type', 'application/json')
  .post('/v2/customers')
  .reply(200, CREATE_CUSTOMER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .matchHeader('content-type', 'application/json')
  .put('/v2/customers/' + UPDATE_CUSTOMER_RES.customer.customer_id)
  .reply(200, UPDATE_CUSTOMER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .delete('/v2/customers/' + DELETE_CUSTOMER_RES.customer.customer_id)
  .reply(200, DELETE_CUSTOMER_RES);

module.exports.LIST_CUSTOMER_RES = LIST_CUSTOMER_RES;
module.exports.SHOW_CUSTOMER_RES = SHOW_CUSTOMER_RES;
module.exports.CREATE_CUSTOMER_RES = CREATE_CUSTOMER_RES;
module.exports.UPDATE_CUSTOMER_RES = UPDATE_CUSTOMER_RES;
module.exports.DELETE_CUSTOMER_RES = DELETE_CUSTOMER_RES;
