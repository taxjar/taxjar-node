'use strict';

const chai = require('chai');
const chaiStuff = require('chai-stuff');
const Taxjar = require('../dist/taxjar');

const rateMock = require('./mocks/rates');
const taxMock = require('./mocks/taxes');
const customerMock = require('./mocks/customers');
const orderMock = require('./mocks/orders');
const refundMock = require('./mocks/refunds');
const nexusRegionMock = require('./mocks/nexus_regions');
const validationMock = require('./mocks/validations');
const summaryRateMock = require('./mocks/summary_rates');

const assert = chai.assert;
chai.use(chaiStuff);

let taxjarClient = {};

beforeEach(() => {
  taxjarClient = new Taxjar({
    apiKey: process.env.TAXJAR_API_KEY || 'test123',
    apiUrl: process.env.TAXJAR_API_URL || 'https://mockapi.taxjar.com'
  });
});

const envVars = [process.env.TAXJAR_API_KEY, process.env.TAXJAR_API_URL].filter(Boolean);
const isLiveTestRun = envVars.length === 2;

before(() => {
  const msg = 'to test live or sandbox environments, both TAXJAR_API_KEY and TAXJAR_API_URL environment variables are required';

  assert.notLengthOf(envVars, 1, msg);
});

describe('TaxJar API', () => {

  describe('client', () => {

    it('instantiates client with API token', () => {
      assert(taxjarClient.config.apiKey, 'no client');
    });

    it('returns error with no API token', () => {
      assert.throws(() => {
        taxjarClient = new Taxjar();
      }, /Please provide a TaxJar API key/);
    });

    it('rejects promise on API error', () => {
      const errorMocks = require('./mocks/errors');

      return taxjarClient.categories().catch(err => {
        assert.instanceOf(err, Error);
        assert.sameProps(err, errorMocks.CATEGORY_ERROR_RES);
      });
    });

    it('gets api config', () => {
      assert.equal(
        taxjarClient.getApiConfig('apiUrl'),
        (process.env.TAXJAR_API_URL || 'https://mockapi.taxjar.com') + '/v2/'
      );
    });

    it('sets api config', () => {
      taxjarClient.setApiConfig('apiUrl', 'https://api.sandbox.taxjar.com');
      assert.equal(taxjarClient.getApiConfig('apiUrl'), 'https://api.sandbox.taxjar.com/v2/');
    });

    it('sets custom headers via instantiation', () => {
      taxjarClient = new Taxjar({
        apiKey: 'test123',
        headers: {
          'X-TJ-Expected-Response': '422'
        }
      });
      assert.include(taxjarClient.getApiConfig('headers'), {
        'X-TJ-Expected-Response': '422'
      });
    });

    it('sets custom headers via api config', () => {
      taxjarClient.setApiConfig('headers', { 'X-TJ-Expected-Response': '422' });
      assert.include(taxjarClient.getApiConfig('headers'), {
        'X-TJ-Expected-Response': '422'
      });
    });

  });

  describe('categories', () => {

    if (isLiveTestRun) {
      it('returns successful response in sandbox', () => (
        taxjarClient.categories().then(res => {
          assert.isOk(res.categories);
        })
      ));
    } else {
      it('lists tax categories', () => {
        const categoryMock = require('./mocks/categories');

        return taxjarClient.categories().then(res => {
          assert(res, 'no categories');
          assert.deepEqual(res, categoryMock.CATEGORY_RES);
        });
      });
    }

  });

  describe('rates', () => {

    const getLaRate = () => taxjarClient.ratesForLocation('90002', {
      city: 'Los Angeles',
      country: 'US'
    });

    if (isLiveTestRun) {
      it('returns successful response in sandbox', () => (
        getLaRate().then(res => {
          assert.isOk(res.rate);
        })
      ));
    } else {
      it('shows tax rates for a location', () => (
        taxjarClient.ratesForLocation('90002').then(res => {
          assert(res, 'no rates');
          assert.deepEqual(res, rateMock.RATE_RES);
        })
      ));

      it('shows tax rates for a location with additional params', () => (
        getLaRate().then(res => {
          assert(res, 'no rates');
          assert.deepEqual(res, rateMock.LA_RATE_RES);
        })
      ));
    }

  });

  describe('taxes', () => {

    const taxForOrder = () => taxjarClient.taxForOrder({
      'from_country': 'US',
      'from_zip': '07001',
      'from_state': 'NJ',
      'to_country': 'US',
      'to_zip': '07446',
      'to_state': 'NJ',
      'amount': 16.50,
      'shipping': 1.5,
      'exemption_type': 'non_exempt'
    });

    if (isLiveTestRun) {
      it('returns successful response in sandbox', () => (
        taxForOrder().then(res => {
          assert.isOk(res.tax);
        })
      ));
    } else {
      it('calculates sales tax for an order', () => (
        taxForOrder().then(res => {
          assert.deepEqual(res, taxMock.TAX_RES);
        })
      ));
    }

  });

  describe('transactions', () => {

    const listOrders = () => taxjarClient.listOrders({
      'from_transaction_date': '2015/05/01',
      'to_transaction_date': '2015/05/31'
    });

    if (isLiveTestRun) {
      it('listOrders returns successful response in sandbox', () => (
        listOrders().then(res => {
          assert.isOk(res.orders);
        })
      ));
    } else {
      it('lists order transactions', () => (
        listOrders().then(res => {
          assert.deepEqual(res, orderMock.LIST_ORDER_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it('showOrder returns successful response in sandbox', () => (
        taxjarClient.showOrder('123').then(res => {
          assert.isOk(res.order);
        })
      ));
    } else {
      it('shows an order transaction', () => (
        taxjarClient.showOrder('123').then(res => {
          assert.deepEqual(res, orderMock.SHOW_ORDER_RES);
        })
      ));
    }

    const createOrder = () => taxjarClient.createOrder({
      'transaction_id': '123',
      'transaction_date': '2015/05/14',
      'to_country': 'US',
      'to_zip': '90002',
      'to_state': 'CA',
      'to_city': 'Los Angeles',
      'to_street': '123 Palm Grove Ln',
      'amount': 16.5,
      'shipping': 1.5,
      'sales_tax': 0.95,
      'exemption_type': 'non_exempt',
      'line_items': [
        {
          'quantity': 1,
          'product_identifier': '12-34243-9',
          'description': 'Fuzzy Widget',
          'unit_price': 15.0,
          'sales_tax': 0.95
        }
      ]
    });

    if (isLiveTestRun) {
      it('createOrder returns successful response in sandbox', () => (
        createOrder().then(res => {
          assert.isOk(res.order);
        })
      ));
    } else {
      it('creates an order transaction', () => (
        createOrder().then(res => {
          assert.deepEqual(res, orderMock.CREATE_ORDER_RES);
        })
      ));
    }

    const updateOrder = () => taxjarClient.updateOrder({
      'transaction_id': '123',
      'amount': 16.5,
      'shipping': 1.5,
      'exemption_type': 'non_exempt',
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
    });

    if (isLiveTestRun) {
      it('updateOrder returns successful response in sandbox', () => (
        updateOrder().then(res => {
          assert.isOk(res.order);
        })
      ));
    } else {
      it('updates an order transaction', () => (
        updateOrder().then(res => {
          assert.deepEqual(res, orderMock.UPDATE_ORDER_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it('deleteOrder returns successful response in sandbox', () => (
        taxjarClient.deleteOrder('123').then(res => {
          assert.isOk(res.order);
        })
      ));
    } else {
      it('deletes an order transaction', () => (
        taxjarClient.deleteOrder('123').then(res => {
          assert.deepEqual(res, orderMock.DELETE_ORDER_RES);
        })
      ));
    }

    const listRefunds = () => taxjarClient.listRefunds({
      'from_transaction_date': '2015/05/01',
      'to_transaction_date': '2015/05/31'
    });

    if (isLiveTestRun) {
      it('listRefunds returns successful response in sandbox', () => (
        listRefunds().then(res => {
          assert.isOk(res.refunds);
        })
      ));
    } else {
      it('lists refund transactions', () => (
        listRefunds().then(res => {
          assert.deepEqual(res, refundMock.LIST_REFUND_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it('showRefund returns successful response in sandbox', () => (
        taxjarClient.showRefund('321').then(res => {
          assert.isOk(res.refund);
        })
      ));
    } else {
      it('shows a refund transaction', () => (
        taxjarClient.showRefund('321').then(res => {
          assert.deepEqual(res, refundMock.SHOW_REFUND_RES);
        })
      ));
    }

    const createRefund = () => taxjarClient.createRefund({
      'transaction_id': '123',
      'transaction_date': '2015/05/14',
      'transaction_reference_id': '123',
      'to_country': 'US',
      'to_zip': '90002',
      'to_state': 'CA',
      'to_city': 'Los Angeles',
      'to_street': '123 Palm Grove Ln',
      'amount': 16.5,
      'shipping': 1.5,
      'sales_tax': 0.95,
      'exemption_type': 'non_exempt',
      'line_items': [
        {
          'quantity': 1,
          'product_identifier': '12-34243-9',
          'description': 'Fuzzy Widget',
          'unit_price': 15.0,
          'sales_tax': 0.95
        }
      ]
    });

    if (isLiveTestRun) {
      it('createRefund returns successful response in sandbox', () => (
        createRefund().then(res => {
          assert.isOk(res.refund);
        })
      ));
    } else {
      it('creates a refund transaction', () => (
        createRefund().then(res => {
          assert.deepEqual(res, refundMock.CREATE_REFUND_RES);
        })
      ));
    }

    const updateRefund = () => taxjarClient.updateRefund({
      'transaction_id': '321',
      'amount': 17,
      'shipping': 2.0,
      'exemption_type': 'non_exempt',
      'line_items': [
        {
          'quantity': 1,
          'product_identifier': '12-34243-0',
          'description': 'Heavy Widget',
          'unit_price': 15.0,
          'sales_tax': 0.95
        }
      ]
    });

    if (isLiveTestRun) {
      it('updateRefund returns successful response in sandbox', () => (
        updateRefund().then(res => {
          assert.isOk(res.refund);
        })
      ));
    } else {
      it('updates a refund transaction', () => (
        updateRefund().then(res => {
          assert.deepEqual(res, refundMock.UPDATE_REFUND_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it('deleteRefund returns successful response in sandbox', () => (
        taxjarClient.deleteRefund('321').then(res => {
          assert.isOk(res.refund);
        })
      ));
    } else {
      it('deletes a refund transaction', () => (
        taxjarClient.deleteRefund('321').then(res => {
          assert.deepEqual(res, refundMock.DELETE_REFUND_RES);
        })
      ));
    }

  });

  describe('customers', () => {

    if (isLiveTestRun) {
      it.skip('listCustomers returns successful response in sandbox', () => (
        taxjarClient.listCustomers().then(res => {
          assert.isOk(res.customers);
        })
      ));
    } else {
      it('lists customers', () => (
        taxjarClient.listCustomers().then(res => {
          assert.deepEqual(res, customerMock.LIST_CUSTOMER_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it.skip('showCustomer returns successful response in sandbox', () => (
        taxjarClient.showCustomer('123').then(res => {
          assert.isOk(res.customer);
        })
      ));
    } else {
      it('shows a customer', () => (
        taxjarClient.showCustomer('123').then(res => {
          assert.deepEqual(res, customerMock.SHOW_CUSTOMER_RES);
        })
      ));
    }

    const createCustomer = () => taxjarClient.createCustomer({
      customer_id: '123',
      exemption_type: 'wholesale',
      name: 'Dunder Mifflin Paper Company',
      exempt_regions: [
        {
          country: 'US',
          state: 'FL'
        },
        {
          country: 'US',
          state: 'PA'
        }
      ],
      country: 'US',
      state: 'PA',
      zip: '18504',
      city: 'Scranton',
      street: '1725 Slough Avenue'
    });

    if (isLiveTestRun) {
      it.skip('createCustomer returns successful response in sandbox', () => (
        createCustomer().then(res => {
          assert.isOk(res.customer);
        })
      ));
    } else {
      it('creates a customer', () => (
        createCustomer().then(res => {
          assert.deepEqual(res, customerMock.CREATE_CUSTOMER_RES);
        })
      ));
    }

    const updateCustomer = () => taxjarClient.updateCustomer({
      customer_id: '123',
      exemption_type: 'wholesale',
      name: 'Sterling Cooper',
      exempt_regions: [
        {
          country: 'US',
          state: 'NY'
        }
      ],
      country: 'US',
      state: 'NY',
      zip: '10010',
      city: 'New York',
      street: '405 Madison Ave'
    });

    if (isLiveTestRun) {
      it.skip('updateCustomer returns successful response in sandbox', () => (
        updateCustomer().then(res => {
          assert.isOk(res.customer);
        })
      ));
    } else {
      it('updates a customer', () => (
        updateCustomer().then(res => {
          assert.deepEqual(res, customerMock.UPDATE_CUSTOMER_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it.skip('deleteCustomer returns successful response in sandbox', () => (
        taxjarClient.deleteCustomer('123').then(res => {
          assert.isOk(res.customer);
        })
      ));
    } else {
      it('deletes a customer', () => (
        taxjarClient.deleteCustomer('123').then(res => {
          assert.deepEqual(res, customerMock.DELETE_CUSTOMER_RES);
        })
      ));
    }

  });

  describe('nexus', () => {

    if (isLiveTestRun) {
      it('returns successful response in sandbox', () => (
        taxjarClient.nexusRegions().then(res => {
          assert.isOk(res.regions);
        })
      ));
    } else {
      it('lists nexus regions', () => (
        taxjarClient.nexusRegions().then(res => {
          assert.deepEqual(res, nexusRegionMock.NEXUS_REGIONS_RES);
        })
      ));
    }

  });

  describe('validations', () => {

    const validateAddress = () => taxjarClient.validateAddress({
      country: 'US',
      state: 'AZ',
      zip: '85297',
      city: 'Gilbert',
      street: '3301 South Greenfield Rd'
    });

    if (isLiveTestRun) {
      it.skip('returns successful response in sandbox', () => (
        validateAddress().then(res => {
          assert.isOk(res.validation);
        })
      )).timeout(5000);
    } else {
      it('validates an address', () => (
        validateAddress().then(res => {
          assert.deepEqual(res, validationMock.ADDRESS_VALIDATION_RES);
        })
      ));
    }

    if (isLiveTestRun) {
      it('returns successful response in sandbox', () => (
        taxjarClient.validate({
          vat: 'FR40303265045'
        }).then(res => {
          assert.isOk(res.validation);
        })
      )).timeout(5000);
    } else {
      it('validates a VAT number', () => (
        taxjarClient.validate({
          vat: 'FR40303265045'
        }).then(res => {
          assert.deepEqual(res, validationMock.VALIDATION_RES);
        })
      ));
    }

  });

  describe('summarized rates', () => {

    if (isLiveTestRun) {
      it('returns successful response in sandbox', () => (
        taxjarClient.summaryRates().then(res => {
          assert.isOk(res.summary_rates);
        })
      ));
    } else {
      it('lists summarized rates', () => (
        taxjarClient.summaryRates().then(res => {
          assert.deepEqual(res, summaryRateMock.SUMMARY_RATES_RES);
        })
      ));
    }

  });

});
