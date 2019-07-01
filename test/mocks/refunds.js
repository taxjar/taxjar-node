'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const LIST_REFUND_RES = {
  "refunds": [
    "321",
    "654"
  ]
};

const SHOW_REFUND_RES = {
  "refund": {
    "transaction_id": "321",
    "user_id": 10649,
    "transaction_date": "2015-05-14T00:00:00Z",
    "transaction_reference_id": "123",
    "exemption_type": "non_exempt",
    "to_country": "US",
    "to_zip": "90002",
    "to_state": "CA",
    "to_city": "LOS ANGELES",
    "to_street": "123 Palm Grove Ln",
    "amount": "17.95",
    "shipping": "2.0",
    "sales_tax": "0.95",
    "line_items": [
      {
        "id": 1,
        "quantity": 1,
        "product_identifier": "12-34243-0",
        "description": "Heavy Widget",
        "unit_price": "15.0",
        "discount": "0.0",
        "sales_tax": "0.95"
      }
    ]
  }
};

const CREATE_REFUND_RES = SHOW_REFUND_RES;
const UPDATE_REFUND_RES = SHOW_REFUND_RES;
const DELETE_REFUND_RES = SHOW_REFUND_RES;

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/transactions/refunds')
  .query(true)
  .reply(200, LIST_REFUND_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/transactions/refunds/' + SHOW_REFUND_RES.refund.transaction_id)
  .reply(200, SHOW_REFUND_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .matchHeader('content-type', 'application/json')
  .post('/v2/transactions/refunds')
  .reply(200, CREATE_REFUND_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .matchHeader('content-type', 'application/json')
  .put('/v2/transactions/refunds/' + UPDATE_REFUND_RES.refund.transaction_id)
  .reply(200, UPDATE_REFUND_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .delete('/v2/transactions/refunds/' + DELETE_REFUND_RES.refund.transaction_id)
  .reply(200, DELETE_REFUND_RES);

module.exports.LIST_REFUND_RES = LIST_REFUND_RES;
module.exports.SHOW_REFUND_RES = SHOW_REFUND_RES;
module.exports.CREATE_REFUND_RES = CREATE_REFUND_RES;
module.exports.UPDATE_REFUND_RES = UPDATE_REFUND_RES;
module.exports.DELETE_REFUND_RES = DELETE_REFUND_RES;
