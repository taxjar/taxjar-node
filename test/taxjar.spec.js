'use strict';

var assert = require('assert');
var taxjar = require('../lib/taxjar')(process.env.TAXJAR_TEST_API_KEY);

var categoryMock = require('./mocks/categories');
var rateMock = require('./mocks/rates');
var taxMock = require('./mocks/taxes');
var orderMock = require('./mocks/orders');
var refundMock = require('./mocks/refunds');

taxjar.setApiConfig('host', 'https://mockapi.taxjar.com');

describe('TaxJar API', function() {

  describe('categories', function() {

    it('should list tax categories', function() {
      taxjar.categories().then(function(res) {
        assert(res, 'no categories');
        assert.deepEqual(res, categoryMock.CATEGORY_RES, 'invalid response');
      });
    });

  });

  describe('rates', function() {

    it('should show tax rates for a location', function() {
      taxjar.ratesForLocation('90002').then(function(res) {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES, 'invalid response');
      });
    });

  });

  describe('taxes', function() {

    it('should calculate sales tax for an order', function() {
      taxjar.taxForOrder({
        'from_country': 'US',
        'from_zip': '07001',
        'from_state': 'NJ',
        'to_country': 'US',
        'to_zip': '07446',
        'to_state': 'NJ',
        'amount': 16.50,
        'shipping': 1.5
      }).then(function(res) {
        assert.deepEqual(res, taxMock.TAX_RES, 'invalid response');
      });
    });

  });

  describe('transactions', function() {

    it('should list order transactions', function() {
      taxjar.listOrders({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31'
      }).then(function(res) {
        assert.deepEqual(res, orderMock.LIST_ORDER_RES, 'invalid response');
      });
    });

    it('should show an order transaction', function() {
      taxjar.showOrder('123').then(function(res) {
        assert.deepEqual(res, orderMock.SHOW_ORDER_RES, 'invalid response');
      });
    });

    it('should create an order transaction', function() {
      taxjar.createOrder({
        'transaction_id': '123',
        'transaction_date': '2015/05/14',
        'to_country': 'US',
        'to_zip': '90002',
        'to_state': 'CA',
        'to_city': 'Los Angeles',
        'to_street': '123 Palm Grove Ln',
        'amount': 17.45,
        'shipping': 1.5,
        'sales_tax': 0.95,
        'line_items': [
          {
            'quantity': 1,
            'product_identifier': '12-34243-9',
            'description': 'Fuzzy Widget',
            'unit_price': 15.0,
            'sales_tax': 0.95
          }
        ]
      }).then(function(res) {
        assert.deepEqual(res, orderMock.CREATE_ORDER_RES, 'invalid response');
      });
    });

    it('should update an order transaction', function() {
      taxjar.updateOrder({
        'transaction_id': '123',
        'amount': 17.45,
        'shipping': 1.5,
        'line_items': [
          {
            'quantity': 1,
            'product_identifier': '12-34243-0',
            'description': 'Heavy Widget',
            'unit_price': 15.0,
            'discount': 0.0,
            'sales_tax': 0.95
          }
        ]
      }).then(function(res) {
        assert.deepEqual(res, orderMock.UPDATE_ORDER_RES, 'invalid response');
      });
    });

    it('should delete an order transaction', function() {
      taxjar.deleteOrder('123').then(function(res) {
        assert.deepEqual(res, orderMock.DELETE_ORDER_RES, 'invalid response');
      });
    });

    it('should list refund transactions', function() {
      taxjar.listRefunds({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31'
      }).then(function(res) {
        assert.deepEqual(res, refundMock.LIST_REFUND_RES, 'invalid response');
      });
    });

    it('should show a refund transaction', function() {
      taxjar.showRefund('321').then(function(res) {
        assert.deepEqual(res, refundMock.SHOW_REFUND_RES, 'invalid response');
      });
    });

    it('should create a refund transaction', function() {
      taxjar.createRefund({
        'transaction_id': '123',
        'transaction_date': '2015/05/14',
        'transaction_reference_id': '123',
        'to_country': 'US',
        'to_zip': '90002',
        'to_state': 'CA',
        'to_city': 'Los Angeles',
        'to_street': '123 Palm Grove Ln',
        'amount': 17.45,
        'shipping': 1.5,
        'sales_tax': 0.95,
        'line_items': [
          {
            'quantity': 1,
            'product_identifier': '12-34243-9',
            'description': 'Fuzzy Widget',
            'unit_price': 15.0,
            'sales_tax': 0.95
          }
        ]
      }).then(function(res) {
        assert.deepEqual(res, refundMock.CREATE_REFUND_RES, 'invalid response');
      });
    });

    it('should update a refund transaction', function() {
      taxjar.updateRefund({
        'transaction_id': '321',
        'amount': 17.95,
        'shipping': 2.0,
        'line_items': [
          {
            'quantity': 1,
            'product_identifier': '12-34243-0',
            'description': 'Heavy Widget',
            'unit_price': 15.0,
            'sales_tax': 0.95
          }
        ]
      }).then(function(res) {
        assert.deepEqual(res, refundMock.UPDATE_REFUND_RES, 'invalid response');
      });
    });

    it('should delete a refund transaction', function() {
      taxjar.deleteRefund('321').then(function(res) {
        assert.deepEqual(res, refundMock.DELETE_REFUND_RES, 'invalid response');
      });
    });

  });

});