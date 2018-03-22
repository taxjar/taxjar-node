# TaxJar Sales Tax API for Node [![NPM Module](http://img.shields.io/npm/v/taxjar.svg?style=flat-square)](https://npmjs.org/package/taxjar) [![Build Status](http://img.shields.io/travis/taxjar/taxjar-node.svg?style=flat-square)](https://travis-ci.org/taxjar/taxjar-node) [![Known Vulnerabilities](https://snyk.io/test/github/taxjar/taxjar-node/badge.svg)](https://snyk.io/test/github/taxjar/taxjar-node)

Official Node client for Sales Tax API v2. For the API documentation, please visit [https://developers.taxjar.com/api/reference/](https://developers.taxjar.com/api/reference/?javascript).

## Requirements

- Node.js v4.0 and later.

## Installation

```
npm install taxjar
```

## Authentication

```javascript
// ES5 Import
const Taxjar = require('taxjar');

// ES6/7 Import
// Using TypeScript? Pass `esModuleInterop` in tsconfig.json
// https://www.typescriptlang.org/docs/handbook/compiler-options.html
import Taxjar from 'taxjar';

const client = new Taxjar({
  apiKey: process.env.TAXJAR_API_KEY
});
```

**Warning:** Never expose your API token in client-side JavaScript. This is insecure and could put your TaxJar account at risk.

## Usage

### List all tax categories

```javascript
client.categories().then(res => {
  res.categories; // Array of categories
});
```

### List tax rates for a location (by zip/postal code)

```javascript
client.ratesForLocation('90002').then(res => {
  res.rate; // Rate object
});
```

### Calculate sales tax for an order

```javascript
client.taxForOrder({
  from_country: 'US',
  from_zip: '07001',
  from_state: 'NJ',
  to_country: 'US',
  to_zip: '07446',
  to_state: 'NJ',
  amount: 16.50,
  shipping: 1.5,
  line_items: [
    {
      quantity: 1,
      unit_price: 15.0,
      product_tax_code: 31000
    }
  ]
}).then(res => {
  res.tax; // Tax object
  res.tax.amount_to_collect; // Amount to collect
});
```

### List order transactions

```javascript
client.listOrders({
  from_transaction_date: '2015/05/01',
  to_transaction_date: '2015/05/31'
}).then(res => {
  res.orders; // Orders object
});
```

### Show order transaction

```javascript
client.showOrder('123').then(res => {
  res.order; // Order object
});
```

### Create order transaction

```javascript
client.createOrder({
  transaction_id: '123',
  transaction_date: '2015/05/14',
  to_country: 'US',
  to_zip: '90002',
  to_state: 'CA',
  to_city: 'Los Angeles',
  to_street: '123 Palm Grove Ln',
  amount: 17.45,
  shipping: 1.5,
  sales_tax: 0.95,
  line_items: [
    {
      quantity: 1,
      product_identifier: '12-34243-9',
      description: 'Fuzzy Widget',
      unit_price: 15.0,
      sales_tax: 0.95
    }
  ]
}).then(res => {
  res.order; // Order object
});
```

### Update order transaction

```javascript
client.updateOrder({
  transaction_id: '123',
  amount: 17.45,
  shipping: 1.5,
  line_items: [
    {
      quantity: 1,
      product_identifier: '12-34243-0',
      description: 'Heavy Widget',
      unit_price: 15.0,
      discount: 0.0,
      sales_tax: 0.95
    }
  ]
}).then(res => {
  res.order; // Order object
});
```

### Delete order transaction

```javascript
client.deleteOrder('123').then(res => {
  res.order; // Order object
});
```

### List refund transactions

```javascript
client.listRefunds({
  from_transaction_date: '2015/05/01',
  to_transaction_date: '2015/05/31'
}).then(res => {
  res.refunds; // Refunds object
});
```

### Show refund transaction

```javascript
client.showRefund('321').then(res => {
  res.refund; // Refund object
});
```

### Create refund transaction

```javascript
client.createRefund({
  transaction_id: '123',
  transaction_date: '2015/05/14',
  transaction_reference_id: '123',
  to_country: 'US',
  to_zip: '90002',
  to_state: 'CA',
  to_city: 'Los Angeles',
  to_street: '123 Palm Grove Ln',
  amount: 17.45,
  shipping: 1.5,
  sales_tax: 0.95,
  line_items: [
    {
      quantity: 1,
      product_identifier: '12-34243-9',
      description: 'Fuzzy Widget',
      unit_price: 15.0,
      sales_tax: 0.95
    }
  ]
}).then(res => {
  res.refund; // Refund object
});
```

### Update refund transaction

```javascript
client.updateRefund({
  transaction_id: '123',
  amount: 17.95,
  shipping: 2.0,
  line_items: [
    {
      quantity: 1,
      product_identifier: '12-34243-0',
      description: 'Heavy Widget',
      unit_price: 15.0,
      sales_tax: 0.95
    }
  ]
}).then(res => {
  res.refund; // Refund object
});
```

### Delete refund transaction

```javascript
client.deleteRefund('123').then(res => {
  res.refund; // Refund object
});
```

### List nexus regions

```javascript
client.nexusRegions().then(res => {
  res.regions; // Array of nexus regions
});
```

### Validate a VAT number

```javascript
client.validate({
  vat: 'FR40303265045'
}).then(res => {
  res.validation; // Validation object
});
```

### Summarize tax rates for all regions

```javascript
client.summaryRates().then(res => {
  res.summary_rates; // Array of summarized rates
});
```

## Sandbox Environment

You can easily configure the client to use the [TaxJar Sandbox](https://developers.taxjar.com/api/reference/#sandbox-environment):

```javascript
// ES5 Import
const Taxjar = require('taxjar');

// ES6/7 Import
import Taxjar from 'taxjar';

const client = new Taxjar({
  apiKey: process.env.TAXJAR_SANDBOX_API_KEY,
  apiUrl: Taxjar.SANDBOX_API_URL
});
```

For testing specific [error response codes](https://developers.taxjar.com/api/reference/#errors), pass the custom `X-TJ-Expected-Response` header:

```javascript
client.setApiConfig('headers', {
  'X-TJ-Expected-Response' => '422'
});
```

## Error Handling

```javascript
client.taxForOrder({
  from_country: 'US',
  from_zip: '07001',
  from_state: 'NJ',
  to_country: 'US',
  to_zip: '07446',
  to_state: 'NJ',
  amount: 16.50,
  shipping: 1.5,
  line_items: [
    {
      quantity: 1,
      unit_price: 15.0,
      product_tax_code: 31000
    }
  ]
}).then(res => {
  res.tax; // Tax object
  res.tax.amount_to_collect; // Amount to collect
}).catch(err => {
  err.detail; // Error detail
  err.status; // Error status code
});
```

## Testing

```
npm test
```

To validate API methods in the TaxJar sandbox environment, pass the following environment variables:

```
TAXJAR_API_URL="https://api.sandbox.taxjar.com" \
TAXJAR_API_KEY="9e0cd62a22f451701f29c3bde214" \
npm test
```
