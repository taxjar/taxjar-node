'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const LIST_ORDER_RES = {
  "orders": [
    "123",
    "456"
  ]
};

const SHOW_ORDER_RES = {
  "order": {
    "transaction_id": "123",
    "user_id": 10649,
    "transaction_date": "2015-05-14T00:00:00Z",
    "provider": "api",
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

const CREATE_ORDER_RES = SHOW_ORDER_RES;
const UPDATE_ORDER_RES = SHOW_ORDER_RES;
const DELETE_ORDER_RES = SHOW_ORDER_RES;

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/transactions/orders')
  .query(true)
  .reply(200, LIST_ORDER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .get('/v2/transactions/orders/' + SHOW_ORDER_RES.order.transaction_id)
  .query(true)
  .reply(200, SHOW_ORDER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .matchHeader('content-type', 'application/json')
  .post('/v2/transactions/orders')
  .reply(200, CREATE_ORDER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .matchHeader('content-type', 'application/json')
  .put('/v2/transactions/orders/' + UPDATE_ORDER_RES.order.transaction_id)
  .reply(200, UPDATE_ORDER_RES);

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .delete('/v2/transactions/orders/' + DELETE_ORDER_RES.order.transaction_id)
  .query(true)
  .reply(200, DELETE_ORDER_RES);

module.exports.LIST_ORDER_RES = LIST_ORDER_RES;
module.exports.SHOW_ORDER_RES = SHOW_ORDER_RES;
module.exports.CREATE_ORDER_RES = CREATE_ORDER_RES;
module.exports.UPDATE_ORDER_RES = UPDATE_ORDER_RES;
module.exports.DELETE_ORDER_RES = DELETE_ORDER_RES;
