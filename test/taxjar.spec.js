'use strict';

const assert = require('chai').assert;
const Taxjar = require('../dist/taxjar');

const rateMock = require('./mocks/rates');
const taxMock = require('./mocks/taxes');
const customerMock = require('./mocks/customers');
const orderMock = require('./mocks/orders');
const refundMock = require('./mocks/refunds');
const nexusRegionMock = require('./mocks/nexus_regions');
const validationMock = require('./mocks/validations');
const summaryRateMock = require('./mocks/summary_rates');

let taxjarClient = {};

beforeEach(function() {
  taxjarClient = new Taxjar({
    apiKey: process.env.TAXJAR_API_KEY || 'test123',
    apiUrl: 'https://mockapi.taxjar.com'
  });
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
        assert.equal(err.error, 'Unauthorized');
        assert.equal(err.detail, "Not authorized for route 'GET /v2/categories'");
        assert.equal(err.status, 401);
      });
    });

    it('gets api config', () => {
      assert.equal(taxjarClient.getApiConfig('apiUrl'), 'https://mockapi.taxjar.com/v2/');
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
      assert.include(taxjarClient.getApiConfig('headers'), { 'X-TJ-Expected-Response': '422' });
    });

    it('sets custom headers via api config', () => {
      taxjarClient.setApiConfig('headers', { 'X-TJ-Expected-Response': '422' });
      assert.include(taxjarClient.getApiConfig('headers'), { 'X-TJ-Expected-Response': '422' });
    });

  });

  describe('categories', () => {

    it('lists tax categories', (done) => {
      const categoryMock = require('./mocks/categories');

      taxjarClient.categories().then(res => {
        assert(res, 'no categories');
        assert.deepEqual(res, categoryMock.CATEGORY_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.categories().then(res => {
          assert.isOk(res.categories);
          done();
        });
      });
    }

  });

  describe('rates', () => {

    it('shows tax rates for a location', (done) => {
      taxjarClient.ratesForLocation('90002').then(res => {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES);
        done();
      });
    });

    it('shows tax rates for a location with additional params', (done) => {
      taxjarClient.ratesForLocation('90002', {
        city: 'Los Angeles',
        country: 'US'
      }).then(res => {
        assert(res, 'no rates');
        assert.deepEqual(res, rateMock.RATE_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.ratesForLocation('90002', {
          city: 'Los Angeles',
          country: 'US'
        }).then(res => {
          assert.isOk(res.rate);
          done();
        });
      });
    }

  });

  describe('taxes', () => {

    it('calculates sales tax for an order', (done) => {
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
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
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
          assert.isOk(res.tax);
          done();
        });
      });
    }

  });

  describe('transactions', () => {

    it('lists order transactions', (done) => {
      taxjarClient.listOrders({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31',
        'provider': 'api'
      }).then(res => {
        assert.deepEqual(res, orderMock.LIST_ORDER_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('listOrders returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.listOrders({
          'from_transaction_date': '2015/05/01',
          'to_transaction_date': '2015/05/31',
          'provider': 'api'
        }).then(res => {
          assert.isOk(res.orders);
          done();
        });
      });
    }

    it('shows an order transaction', (done) => {
      taxjarClient.showOrder('123', {provider: 'api'}).then(res => {
        assert.deepEqual(res, orderMock.SHOW_ORDER_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('showOrder returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.showOrder('123', {provider: 'api'}).then(res => {
          assert.isOk(res.order);
          done();
        });
      });
    }

    it('creates an order transaction', (done) => {
      taxjarClient.createOrder({
        'transaction_id': '123',
        'transaction_date': '2015/05/14',
        'provider': 'api',
        'to_country': 'US',
        'to_zip': '90002',
        'to_state': 'CA',
        'to_city': 'Los Angeles',
        'to_street': '123 Palm Grove Ln',
        'amount': 16.5,
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
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('createOrder returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.createOrder({
          'transaction_id': '123',
          'transaction_date': '2015/05/14',
          'provider': 'api',
          'to_country': 'US',
          'to_zip': '90002',
          'to_state': 'CA',
          'to_city': 'Los Angeles',
          'to_street': '123 Palm Grove Ln',
          'amount': 16.5,
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
          assert.isOk(res.order);
          done();
        });
      });
    }

    it('updates an order transaction', (done) => {
      taxjarClient.updateOrder({
        'transaction_id': '123',
        'amount': 16.5,
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
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('updateOrder returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.updateOrder({
          'transaction_id': '123',
          'amount': 16.5,
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
          assert.isOk(res.order);
          done();
        });
      });
    }

    it('deletes an order transaction', (done) => {
      taxjarClient.deleteOrder('123', {provider: 'api'}).then(res => {
        assert.deepEqual(res, orderMock.DELETE_ORDER_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('deleteOrder returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.deleteOrder('123', {provider: 'api'}).then(res => {
          assert.isOk(res.order);
          done();
        });
      });
    }

    it('lists refund transactions', (done) => {
      taxjarClient.listRefunds({
        'from_transaction_date': '2015/05/01',
        'to_transaction_date': '2015/05/31',
        'provider': 'api'
      }).then(res => {
        assert.deepEqual(res, refundMock.LIST_REFUND_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('listRefunds returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.listRefunds({
          'from_transaction_date': '2015/05/01',
          'to_transaction_date': '2015/05/31',
          'provider': 'api'
        }).then(res => {
          assert.isOk(res.refunds);
          done();
        });
      });
    }

    it('shows a refund transaction', (done) => {
      taxjarClient.showRefund('321', {provider: 'api'}).then(res => {
        assert.deepEqual(res, refundMock.SHOW_REFUND_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('showRefund returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.showRefund('321', {provider: 'api'}).then(res => {
          assert.isOk(res.refund);
          done();
        });
      });
    }

    it('creates a refund transaction', (done) => {
      taxjarClient.createRefund({
        'transaction_id': '123',
        'transaction_date': '2015/05/14',
        'transaction_reference_id': '123',
        'provider': 'api',
        'to_country': 'US',
        'to_zip': '90002',
        'to_state': 'CA',
        'to_city': 'Los Angeles',
        'to_street': '123 Palm Grove Ln',
        'amount': 16.5,
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
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('createRefund returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.createRefund({
          'transaction_id': '123',
          'transaction_date': '2015/05/14',
          'transaction_reference_id': '123',
          'provider': 'api',
          'to_country': 'US',
          'to_zip': '90002',
          'to_state': 'CA',
          'to_city': 'Los Angeles',
          'to_street': '123 Palm Grove Ln',
          'amount': 16.5,
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
          assert.isOk(res.refund);
          done();
        });
      });
    }

    it('updates a refund transaction', (done) => {
      taxjarClient.updateRefund({
        'transaction_id': '321',
        'amount': 17,
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
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('updateRefund returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.updateRefund({
          'transaction_id': '321',
          'amount': 17,
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
          assert.isOk(res.refund);
          done();
        });
      });
    }

    it('deletes a refund transaction', (done) => {
      taxjarClient.deleteRefund('321', {provider: 'api'}).then(res => {
        assert.deepEqual(res, refundMock.DELETE_REFUND_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('deleteRefund returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.deleteRefund('321', {provider: 'api'}).then(res => {
          assert.isOk(res.refund);
          done();
        });
      });
    }

  });

  describe('customers', () => {

    it('lists customers', (done) => {
      taxjarClient.listCustomers().then(res => {
        assert.deepEqual(res, customerMock.LIST_CUSTOMER_RES);
        done();
      });
    });

    // if (process.env.TAXJAR_API_URL) {
    //   it('listCustomers returns successful response in sandbox', (done) => {
    //     taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
    //     taxjarClient.listCustomers().then(res => {
    //       assert.isOk(res.customers);
    //       done();
    //     });
    //   });
    // }

    it('shows a customer', (done) => {
      taxjarClient.showCustomer('123').then(res => {
        assert.deepEqual(res, customerMock.SHOW_CUSTOMER_RES);
        done();
      });
    });

    // if (process.env.TAXJAR_API_URL) {
    //   it('showCustomer returns successful response in sandbox', (done) => {
    //     taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
    //     taxjarClient.showCustomer('123').then(res => {
    //       assert.isOk(res.customer);
    //       done();
    //     });
    //   });
    // }

    it('creates a customer', (done) => {
      taxjarClient.createCustomer({
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
      }).then(res => {
        assert.deepEqual(res, customerMock.CREATE_CUSTOMER_RES);
        done();
      });
    });

    // if (process.env.TAXJAR_API_URL) {
    //   it('createCustomer returns successful response in sandbox', (done) => {
    //     taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
    //     taxjarClient.createCustomer({
    //       customer_id: '123',
    //       exemption_type: 'wholesale',
    //       name: 'Dunder Mifflin Paper Company',
    //       exempt_regions: [
    //         {
    //           country: 'US',
    //           state: 'FL'
    //         },
    //         {
    //           country: 'US',
    //           state: 'PA'
    //         }
    //       ],
    //       country: 'US',
    //       state: 'PA',
    //       zip: '18504',
    //       city: 'Scranton',
    //       street: '1725 Slough Avenue'
    //     }).then(res => {
    //       assert.isOk(res.customer);
    //       done();
    //     });
    //   });
    // }

    it('updates a customer', (done) => {
      taxjarClient.updateCustomer({
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
      }).then(res => {
        assert.deepEqual(res, customerMock.UPDATE_CUSTOMER_RES);
        done();
      });
    });

    // if (process.env.TAXJAR_API_URL) {
    //   it('updateCustomer returns successful response in sandbox', (done) => {
    //     taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
    //     taxjarClient.updateCustomer({
    //       customer_id: '123',
    //       exemption_type: 'wholesale',
    //       name: 'Sterling Cooper',
    //       exempt_regions: [
    //         {
    //           country: 'US',
    //           state: 'NY'
    //         }
    //       ],
    //       country: 'US',
    //       state: 'NY',
    //       zip: '10010',
    //       city: 'New York',
    //       street: '405 Madison Ave'
    //     }).then(res => {
    //       assert.isOk(res.customer);
    //       done();
    //     });
    //   });
    // }

    it('deletes a customer', (done) => {
      taxjarClient.deleteCustomer('123').then(res => {
        assert.deepEqual(res, customerMock.DELETE_CUSTOMER_RES);
        done();
      });
    });

    // if (process.env.TAXJAR_API_URL) {
    //   it('deleteCustomer returns successful response in sandbox', (done) => {
    //     taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
    //     taxjarClient.deleteCustomer('123').then(res => {
    //       assert.isOk(res.customer);
    //       done();
    //     });
    //   });
    // }

  });

  describe('nexus', () => {

    it('lists nexus regions', (done) => {
      taxjarClient.nexusRegions().then(res => {
        assert.deepEqual(res, nexusRegionMock.NEXUS_REGIONS_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.nexusRegions().then(res => {
          assert.isOk(res.regions);
          done();
        });
      });
    }

  });

  describe('validations', () => {

    it('validates an address', (done) => {
      taxjarClient.validateAddress({
        country: 'US',
        state: 'AZ',
        zip: '85297',
        city: 'Gilbert',
        street: '3301 South Greenfield Rd'
      }).then(res => {
        assert.deepEqual(res, validationMock.ADDRESS_VALIDATION_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.validateAddress({
          country: 'US',
          state: 'AZ',
          zip: '85297',
          city: 'Gilbert',
          street: '3301 South Greenfield Rd'
        }).then(res => {
          assert.isOk(res.validation);
          done();
        });
      }).timeout(5000);
    }

    it('validates a VAT number', (done) => {
      taxjarClient.validate({
        vat: 'FR40303265045'
      }).then(res => {
        assert.deepEqual(res, validationMock.VALIDATION_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.validate({
          vat: 'FR40303265045'
        }).then(res => {
          assert.isOk(res.validation);
          done();
        });
      }).timeout(5000);
    }

  });

  describe('summarized rates', () => {

    it('lists summarized rates', (done) => {
      taxjarClient.summaryRates().then(res => {
        assert.deepEqual(res, summaryRateMock.SUMMARY_RATES_RES);
        done();
      });
    });

    if (process.env.TAXJAR_API_URL) {
      it('returns successful response in sandbox', (done) => {
        taxjarClient.setApiConfig('apiUrl', process.env.TAXJAR_API_URL);
        taxjarClient.summaryRates().then(res => {
          assert.isOk(res.summary_rates);
          done();
        });
      });
    }

  });

});
