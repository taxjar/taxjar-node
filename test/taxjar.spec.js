'use strict';

var assert = require('assert');
var taxjar = require('../lib/taxjar')(process.env.TAXJAR_TEST_API_KEY);

var categoryMock = require('./mocks/categories');
var rateMock = require('./mocks/rates');
var taxMock = require('./mocks/taxes');
var orderMock = require('./mocks/orders');
var refundMock = require('./mocks/refunds');
var validationMock = require('./mocks/validations');
var summaryRateMock = require('./mocks/summary_rates');

taxjar.setApiConfig('host', 'https://mockapi.taxjar.com');

describe('TaxJar API', function() {

  describe('categories', function() {

    it('lists tax categories', function() {
      taxjar.categories().then(function(res) {
        assert(res, 'no categories');
        assert.deepEqual(res, categoryMock.CATEGORY_RES);
      });
    });

  });

  describe('rates', function() {

    it('shows tax rates for a location', function() {
      taxjar.ratesForLocation('90002').then(function(res) {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES);
      });
    });
    
    it('shows tax rates for a location with additional params', function() {
      taxjar.ratesForLocation('90002', {
        city: 'Los Angeles',
        country: 'US'
      }).then(function(res) {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES);
      });
    });

  });

  describe('taxes', function() {

    it('calculates sales tax for an order', function() {
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
        assert.deepEqual(res, taxMock.TAX_RES);
      });
    });

  });

  describe('transactions', function() {

    it('lists order transactions', function() {
      taxjar.listOrders({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31'
      }).then(function(res) {
        assert.deepEqual(res, orderMock.LIST_ORDER_RES);
      });
    });

    it('shows an order transaction', function() {
      taxjar.showOrder('123').then(function(res) {
        assert.deepEqual(res, orderMock.SHOW_ORDER_RES);
      });
    });

    it('creates an order transaction', function() {
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
        assert.deepEqual(res, orderMock.CREATE_ORDER_RES);
      });
    });

    it('updates an order transaction', function() {
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
        assert.deepEqual(res, orderMock.UPDATE_ORDER_RES);
      });
    });

    it('deletes an order transaction', function() {
      taxjar.deleteOrder('123').then(function(res) {
        assert.deepEqual(res, orderMock.DELETE_ORDER_RES);
      });
    });

    it('lists refund transactions', function() {
      taxjar.listRefunds({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31'
      }).then(function(res) {
        assert.deepEqual(res, refundMock.LIST_REFUND_RES);
      });
    });

    it('shows a refund transaction', function() {
      taxjar.showRefund('321').then(function(res) {
        assert.deepEqual(res, refundMock.SHOW_REFUND_RES);
      });
    });

    it('creates a refund transaction', function() {
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
        assert.deepEqual(res, refundMock.CREATE_REFUND_RES);
      });
    });

    it('updates a refund transaction', function() {
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
        assert.deepEqual(res, refundMock.UPDATE_REFUND_RES);
      });
    });

    it('deletes a refund transaction', function() {
      taxjar.deleteRefund('321').then(function(res) {
        assert.deepEqual(res, refundMock.DELETE_REFUND_RES);
      });
    });
    
    it('validates a VAT number', function() {
      taxjar.validate({
        vat: 'FR40303265045'
      }).then(function(res) {
        assert.deepEqual(res, validationMock.VALIDATION_RES);
      });
    });
    
    it('lists summarized rates', function() {
      taxjar.summaryRates().then(function(res) {
        assert.deepEqual(res, summaryRateMock.SUMMARY_RATES_RES);
      });
    });

  });

});