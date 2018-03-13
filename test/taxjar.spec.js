'use strict';

const assert = require('assert');
const Taxjar = require('../dist/taxjar');

const rateMock = require('./mocks/rates');
const taxMock = require('./mocks/taxes');
const orderMock = require('./mocks/orders');
const refundMock = require('./mocks/refunds');
const nexusRegionMock = require('./mocks/nexus_regions');
const validationMock = require('./mocks/validations');
const summaryRateMock = require('./mocks/summary_rates');

let taxjarClient = new Taxjar({
  api_url: 'https://mockapi.taxjar.com',
  api_key: 'test123'
});

describe('TaxJar API', () => {

  describe('client', () => {

    it('instantiates client with API token', () => {
      assert(taxjarClient, 'no client');
    });

    it('returns error with no API token', () => {
      assert.throws(() => {
        taxjarClient = new Taxjar();
      }, /Please provide a TaxJar API key/);
    });

    it('rejects promise on API error', () => {
      const errorMocks = require('./mocks/errors');

      taxjarClient.categories().catch(err => {
        assert.equal(err instanceof Error, true);
        assert.deepEqual(err, errorMocks.CATEGORY_ERROR_RES);
        assert.equal(err.detail, "Not authorized for route 'GET /v2/categories'");
        assert.equal(err.status, 401);
      });
    });

  });

  describe('categories', () => {

    it('lists tax categories', () => {
      const categoryMock = require('./mocks/categories');

      taxjarClient.categories().then(res => {
        assert(res, 'no categories');
        assert.deepEqual(res, categoryMock.CATEGORY_RES);
      });
    });

  });

  describe('rates', () => {

    it('shows tax rates for a location', () => {
      taxjarClient.ratesForLocation('90002').then(res => {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES);
      });
    });

    it('shows tax rates for a location with additional params', () => {
      taxjarClient.ratesForLocation('90002', {
        city: 'Los Angeles',
        country: 'US'
      }).then(res => {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES);
      });
    });

  });

  describe('taxes', () => {

    it('calculates sales tax for an order', () => {
      taxjarClient.taxForOrder({
        'from_country': 'US',
        'from_zip': '07001',
        'from_state': 'NJ',
        'to_country': 'US',
        'to_zip': '07446',
        'to_state': 'NJ',
        'amount': 16.50,
        'shipping': 1.5
      }).then(res => {
        assert.deepEqual(res, taxMock.TAX_RES);
      });
    });

  });

  describe('transactions', () => {

    it('lists order transactions', () => {
      taxjarClient.listOrders({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31'
      }).then(res => {
        assert.deepEqual(res, orderMock.LIST_ORDER_RES);
      });
    });

    it('shows an order transaction', () => {
      taxjarClient.showOrder('123').then(res => {
        assert.deepEqual(res, orderMock.SHOW_ORDER_RES);
      });
    });

    it('creates an order transaction', () => {
      taxjarClient.createOrder({
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
      }).then(res => {
        assert.deepEqual(res, orderMock.CREATE_ORDER_RES);
      });
    });

    it('updates an order transaction', () => {
      taxjarClient.updateOrder({
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
      }).then(res => {
        assert.deepEqual(res, orderMock.UPDATE_ORDER_RES);
      });
    });

    it('deletes an order transaction', () => {
      taxjarClient.deleteOrder('123').then(res => {
        assert.deepEqual(res, orderMock.DELETE_ORDER_RES);
      });
    });

    it('lists refund transactions', () => {
      taxjarClient.listRefunds({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31'
      }).then(res => {
        assert.deepEqual(res, refundMock.LIST_REFUND_RES);
      });
    });

    it('shows a refund transaction', () => {
      taxjarClient.showRefund('321').then(res => {
        assert.deepEqual(res, refundMock.SHOW_REFUND_RES);
      });
    });

    it('creates a refund transaction', () => {
      taxjarClient.createRefund({
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
      }).then(res => {
        assert.deepEqual(res, refundMock.CREATE_REFUND_RES);
      });
    });

    it('updates a refund transaction', () => {
      taxjarClient.updateRefund({
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
      }).then(res => {
        assert.deepEqual(res, refundMock.UPDATE_REFUND_RES);
      });
    });

    it('deletes a refund transaction', () => {
      taxjarClient.deleteRefund('321').then(res => {
        assert.deepEqual(res, refundMock.DELETE_REFUND_RES);
      });
    });

  });

  describe('nexus', () => {

    it('lists nexus regions', () => {
      taxjarClient.nexusRegions().then(res => {
        assert.deepEqual(res, nexusRegionMock.NEXUS_REGIONS_RES);
      });
    });

  });

  describe('validations', () => {

    it('validates a VAT number', () => {
      taxjarClient.validate({
        vat: 'FR40303265045'
      }).then(res => {
        assert.deepEqual(res, validationMock.VALIDATION_RES);
      });
    });

  });

  describe('summarized rates', () => {

    it('lists summarized rates', () => {
      taxjarClient.summaryRates().then(res => {
        assert.deepEqual(res, summaryRateMock.SUMMARY_RATES_RES);
      });
    });

  });

});
