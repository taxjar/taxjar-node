'use strict';

const nock = require('nock');

const TEST_API_HOST = 'https://mockapi.taxjar.com';

const TAX_RES = {
  "tax": {
    "order_total_amount": 16.5,
    "amount_to_collect": 1.16,
    "has_nexus": true,
    "freight_taxable": true,
    "tax_source": "destination",
    "breakdown": {
      "shipping": {
        "state_amount": 0.11,
        "state_sales_tax_rate": 0.07,
        "county_amount": 0,
        "county_tax_rate": 0,
        "city_amount": 0,
        "city_tax_rate": 0,
        "special_district_amount": 0,
        "special_tax_rate": 0
      },
      "state_taxable_amount": 16.5,
      "state_tax_collectable": 1.16,
      "county_taxable_amount": 0,
      "county_tax_collectable": 0,
      "city_taxable_amount": 0,
      "city_tax_collectable": 0,
      "special_district_taxable_amount": 0,
      "special_district_tax_collectable": 0,
      "line_items": [
        {
          "id": "1",
          "state_taxable_amount": 15,
          "state_sales_tax_rate": 0.07,
          "county_taxable_amount": 0,
          "county_tax_rate": 0,
          "city_taxable_amount": 0,
          "city_tax_rate": 0,
          "special_district_taxable_amount": 0,
          "special_tax_rate": 0
        }
      ]
    }
  }
};

nock(TEST_API_HOST)
  .matchHeader('Authorization', /Bearer.*/)
  .post('/v2/taxes', {
    from_country: 'US',
    from_zip: '07001',
    from_state: 'NJ',
    to_country: 'US',
    to_zip: '07446',
    to_state: 'NJ',
    amount: 16.5,
    shipping: 1.5
  })
  .reply(200, TAX_RES);

module.exports.TAX_RES = TAX_RES;
