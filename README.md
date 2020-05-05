# TaxJar Sales Tax API for Node [![NPM Module](https://img.shields.io/npm/v/taxjar.svg?style=flat-square)](https://npmjs.org/package/taxjar) [![Build Status](https://img.shields.io/travis/taxjar/taxjar-node.svg?style=flat-square)](https://travis-ci.org/taxjar/taxjar-node) [![Known Vulnerabilities](https://snyk.io/test/github/taxjar/taxjar-node/badge.svg)](https://snyk.io/test/github/taxjar/taxjar-node)

<a href="https://developers.taxjar.com"><img src="https://www.taxjar.com/img/TJ_logo_color_office_png.png" alt="TaxJar" width="220"></a>

Official Node client for Sales Tax API v2. For the API documentation, please visit [https://developers.taxjar.com/api/reference/](https://developers.taxjar.com/api/reference/?javascript).

<hr>

[Requirements](#requirements)<br>
[Installation](#installation)<br>
[Authentication](#authentication)<br>
[Usage](#usage)<br>
[Sandbox Environment](#sandbox-environment)<br>
[Error Handling](#error-handling)<br>
[Testing](#testing)

<hr>

## Requirements

- Node.js v4.0 and later.

## Installation

```
npm install taxjar
```

## Authentication

```javascript
// CommonJS Import
const Taxjar = require('taxjar');

// ES6 Import
// Using TypeScript? Pass `esModuleInterop` in tsconfig.json
// https://www.typescriptlang.org/docs/handbook/compiler-options.html
import Taxjar from 'taxjar';

const client = new Taxjar({
  apiKey: process.env.TAXJAR_API_KEY
});
```

_**Warning:** Never expose your API token in client-side JavaScript. This is insecure and could put your TaxJar account at risk._

You're now ready to use TaxJar! [Check out our quickstart guide](https://developers.taxjar.com/api/guides/node/#node-quickstart) to get up and running quickly.

## Usage

[`categories` - List all tax categories](#list-all-tax-categories-api-docs)<br>
[`taxForOrder` - Calculate sales tax for an order](#calculate-sales-tax-for-an-order-api-docs)<br>
[`listOrders` - List order transactions](#list-order-transactions-api-docs)<br>
[`showOrder` - Show order transaction](#show-order-transaction-api-docs)<br>
[`createOrder` - Create order transaction](#create-order-transaction-api-docs)<br>
[`updateOrder` - Update order transaction](#update-order-transaction-api-docs)<br>
[`deleteOrder` - Delete order transaction](#delete-order-transaction-api-docs)<br>
[`listRefunds` - List refund transactions](#list-refund-transactions-api-docs)<br>
[`showRefund` - Show refund transaction](#show-refund-transaction-api-docs)<br>
[`createRefund` - Create refund transaction](#create-refund-transaction-api-docs)<br>
[`updateRefund` - Update refund transaction](#update-refund-transaction-api-docs)<br>
[`deleteRefund` - Delete refund transaction](#delete-refund-transaction-api-docs)<br>
[`listCustomers` - List customers](#list-customers-api-docs)<br>
[`showCustomer` - Show customer](#show-customer-api-docs)<br>
[`createCustomer` - Create customer](#create-customer-api-docs)<br>
[`updateCustomer` - Update customer](#update-customer-api-docs)<br>
[`deleteCustomer` - Delete customer](#delete-customer-api-docs)<br>
[`ratesForLocation` - List tax rates for a location (by zip/postal code)](#list-tax-rates-for-a-location-by-zippostal-code-api-docs)<br>
[`nexusRegions` - List nexus regions](#list-nexus-regions-api-docs)<br>
[`validateAddress` - Validate an address](#validate-an-address-api-docs)<br>
[`validate` - Validate a VAT number](#validate-a-vat-number-api-docs)<br>
[`summaryRates` - Summarize tax rates for all regions](#summarize-tax-rates-for-all-regions-api-docs)

<hr>

### List all tax categories <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-list-tax-categories))_</small>

> The TaxJar API provides product-level tax rules for a subset of product categories. These categories are to be used for products that are either exempt from sales tax in some jurisdictions or are taxed at reduced rates. You need not pass in a product tax code for sales tax calculations on product that is fully taxable. Simply leave that parameter out.

```javascript
client.categories().then(res => {
  res.categories; // Array of categories
});
```

### Calculate sales tax for an order <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#post-calculate-sales-tax-for-an-order))_</small>

> Shows the sales tax that should be collected for a given order.

```javascript
client.taxForOrder({
  from_country: 'US',
  from_zip: '07001',
  from_state: 'NJ',
  from_city: 'Avenel',
  from_street: '305 W Village Dr',
  to_country: 'US',
  to_zip: '07446',
  to_state: 'NJ',
  to_city: 'Ramsey',
  to_street: '63 W Main St',
  amount: 16.50,
  shipping: 1.5,
  line_items: [
    {
      id: '1',
      quantity: 1,
      product_tax_code: '31000',
      unit_price: 15.0,
      discount: 0
    }
  ]
}).then(res => {
  res.tax; // Tax object
  res.tax.amount_to_collect; // Amount to collect
});
```

### List order transactions <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-list-order-transactions))_</small>

> Lists existing order transactions created through the API.

```javascript
client.listOrders({
  from_transaction_date: '2015/05/01',
  to_transaction_date: '2015/05/31'
}).then(res => {
  res.orders; // Orders object
});
```

### Show order transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-show-an-order-transaction))_</small>

> Shows an existing order transaction created through the API.

```javascript
client.showOrder('123').then(res => {
  res.order; // Order object
});
```

### Create order transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#post-create-an-order-transaction))_</small>

> Creates a new order transaction.

```javascript
client.createOrder({
  transaction_id: '123',
  transaction_date: '2015/05/14',
  from_country: 'US',
  from_zip: '92093',
  from_state: 'CA',
  from_city: 'La Jolla',
  from_street: '9500 Gilman Drive',
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
      id: '1',
      quantity: 1,
      product_identifier: '12-34243-9',
      description: 'Fuzzy Widget',
      unit_price: 15.0,
      discount: 0,
      sales_tax: 0.95
    }
  ]
}).then(res => {
  res.order; // Order object
});
```

### Update order transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#put-update-an-order-transaction))_</small>

> Updates an existing order transaction created through the API.

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

### Delete order transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#delete-delete-an-order-transaction))_</small>

> Deletes an existing order transaction created through the API.

```javascript
client.deleteOrder('123').then(res => {
  res.order; // Order object
});
```

### List refund transactions <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-list-refund-transactions))_</small>

> Lists existing refund transactions created through the API.

```javascript
client.listRefunds({
  from_transaction_date: '2015/05/01',
  to_transaction_date: '2015/05/31'
}).then(res => {
  res.refunds; // Refunds object
});
```

### Show refund transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-show-a-refund-transaction))_</small>

> Shows an existing refund transaction created through the API.

```javascript
client.showRefund('123-refund').then(res => {
  res.refund; // Refund object
});
```

### Create refund transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#post-create-a-refund-transaction))_</small>

> Creates a new refund transaction.

```javascript
client.createRefund({
  transaction_id: '123-refund',
  transaction_reference_id: '123',
  transaction_date: '2015/05/14',
  from_country: 'US',
  from_zip: '92093',
  from_state: 'CA',
  from_city: 'La Jolla',
  from_street: '9500 Gilman Drive',
  to_country: 'US',
  to_zip: '90002',
  to_state: 'CA',
  to_city: 'Los Angeles',
  to_street: '123 Palm Grove Ln',
  amount: -17.45,
  shipping: -1.5,
  sales_tax: -0.95,
  line_items: [
    {
      id: '1',
      quantity: 1,
      product_identifier: '12-34243-9',
      description: 'Fuzzy Widget',
      unit_price: -15.0,
      discount: -0,
      sales_tax: -0.95
    }
  ]
}).then(res => {
  res.refund; // Refund object
});
```

### Update refund transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#put-update-a-refund-transaction))_</small>

> Updates an existing refund transaction created through the API.

```javascript
client.updateRefund({
  transaction_id: '123-refund',
  transaction_reference_id: '123',
  amount: -17.95,
  shipping: -2.0,
  line_items: [
    {
      id: '1',
      quantity: 1,
      product_identifier: '12-34243-0',
      description: 'Heavy Widget',
      unit_price: -15.0,
      discount: -0,
      sales_tax: -0.95
    }
  ]
}).then(res => {
  res.refund; // Refund object
});
```

### Delete refund transaction <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#delete-delete-a-refund-transaction))_</small>

> Deletes an existing refund transaction created through the API.

```javascript
client.deleteRefund('123-refund').then(res => {
  res.refund; // Refund object
});
```

### List customers <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-list-customers))_</small>

> Lists existing customers created through the API.

```javascript
client.listCustomers().then(res => {
  res.customers; // Customers object
});
```

### Show customer <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-show-a-customer))_</small>

> Shows an existing customer created through the API.

```javascript
client.showCustomer('123').then(res => {
  res.customer; // Customer object
});
```

### Create customer <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#post-create-a-customer))_</small>

> Creates a new customer.

```javascript
client.createCustomer({
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
  res.customer; // Customer object
});
```

### Update customer <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#put-update-a-customer))_</small>

> Updates an existing customer created through the API.

```javascript
client.updateCustomer({
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
  res.customer; // Customer object
});
```

### Delete customer <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#delete-delete-a-customer))_</small>

> Deletes an existing customer created through the API.

```javascript
client.deleteCustomer('123').then(res => {
  res.customer; // Customer object
});
```

### List tax rates for a location (by zip/postal code) <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-show-tax-rates-for-a-location))_</small>

> Shows the sales tax rates for a given location.
>
> **Please note this method only returns the full combined rate for a given location.** It does not support nexus determination, sourcing based on a ship from and ship to address, shipping taxability, product exemptions, customer exemptions, or sales tax holidays. We recommend using [`taxForOrder` to accurately calculate sales tax for an order](#calculate-sales-tax-for-an-order-api-docs).

```javascript
client.ratesForLocation('90002').then(res => {
  res.rate; // Rate object
});
```

### List nexus regions <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-list-nexus-regions))_</small>

> Lists existing nexus locations for a TaxJar account.

```javascript
client.nexusRegions().then(res => {
  res.regions; // Array of nexus regions
});
```

### Validate an address <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#post-validate-an-address))_</small>

> Validates a customer address and returns back a collection of address matches. **Address validation requires a [TaxJar Plus](https://www.taxjar.com/plus/) subscription.**

```javascript
client.validateAddress({
  country: 'US',
  state: 'AZ',
  zip: '85297',
  city: 'Gilbert',
  street: '3301 South Greenfield Rd'
}).then(res => {
  res.addresses; // Array of address matches
});
```

### Validate a VAT number <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-validate-a-vat-number))_</small>

> Validates an existing VAT identification number against [VIES](http://ec.europa.eu/taxation_customs/vies/).

```javascript
client.validate({
  vat: 'FR40303265045'
}).then(res => {
  res.validation; // Validation object
});
```

### Summarize tax rates for all regions <small>_([API docs](https://developers.taxjar.com/api/reference/?javascript#get-summarize-tax-rates-for-all-regions))_</small>

> Retrieve minimum and average sales tax rates by region as a backup.
>
> This method is useful for periodically pulling down rates to use if the TaxJar API is unavailable. However, it does not support nexus determination, sourcing based on a ship from and ship to address, shipping taxability, product exemptions, customer exemptions, or sales tax holidays. We recommend using [`taxForOrder` to accurately calculate sales tax for an order](#calculate-sales-tax-for-an-order-api-docs).

```javascript
client.summaryRates().then(res => {
  res.summary_rates; // Array of summarized rates
});
```

## Sandbox Environment

You can easily configure the client to use the [TaxJar Sandbox](https://developers.taxjar.com/api/reference/?javascript#sandbox-environment):

```javascript
// CommonJS Import
const Taxjar = require('taxjar');

// ES6 Import
import Taxjar from 'taxjar';

const client = new Taxjar({
  apiKey: process.env.TAXJAR_SANDBOX_API_KEY,
  apiUrl: Taxjar.SANDBOX_API_URL
});
```

For testing specific [error response codes](https://developers.taxjar.com/api/reference/?javascript#errors), pass the custom `X-TJ-Expected-Response` header:

```javascript
client.setApiConfig('headers', {
  'X-TJ-Expected-Response': '422'
});
```

## Error Handling

```javascript
client.taxForOrder({
  from_country: 'US',
  from_zip: '07001',
  from_state: 'NJ',
  from_city: 'Avenel',
  from_street: '305 W Village Dr',
  to_country: 'US',
  to_zip: '07446',
  to_state: 'NJ',
  to_city: 'Ramsey',
  to_street: '63 W Main St',
  amount: 16.50,
  shipping: 1.5,
  line_items: [
    {
      id: '1',
      quantity: 1,
      product_tax_code: '31000',
      unit_price: 15.0,
      discount: 0,
      sales_tax: 0.95
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

In TypeScript, you may want to first check the error's type before handling:

```ts
client.taxForOrder(/* ... */)
  .catch(err => {
    if (err instanceof Taxjar.Error) {
      err.detail; // Error detail
      err.status; // Error status code
    } else {
      // handle non-taxjar error
    }
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
