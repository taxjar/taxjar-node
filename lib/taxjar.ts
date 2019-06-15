import request from './util/request';
import { TaxjarTypes } from './util/types';

class Taxjar {
  public static DEFAULT_API_URL = 'https://api.taxjar.com';
  public static SANDBOX_API_URL = 'https://api.sandbox.taxjar.com';
  public static API_VERSION = 'v2';

  private config: TaxjarTypes.Config;
  private request: TaxjarTypes.Request;

  constructor(config: TaxjarTypes.Config) {
    let apiUrl = Taxjar.DEFAULT_API_URL + '/' + Taxjar.API_VERSION + '/';

    if (!config || !config['apiKey']) {
      throw new Error('Please provide a TaxJar API key');
    }

    if (config && config['apiUrl']) {
      apiUrl = config['apiUrl'] + '/' + Taxjar.API_VERSION + '/';
    }

    this.config = {
      apiUrl: apiUrl,
      apiKey: config['apiKey'],
      headers: config['headers']
    };

    this.request = request(this.config);
  }

  getApiConfig(index: string): any {
    return this.config[index];
  }

  setApiConfig(index: string, value: any): void {
    if (index === 'apiUrl') {
      value += '/' + Taxjar.API_VERSION + '/';
    }

    this.config[index] = value;
    this.request = request(this.config);
  }

  categories(): Promise<any> {
    return this.request.get({
      url: 'categories'
    });
  }

  ratesForLocation(zip: string, params?: TaxjarTypes.RateParams): Promise<any> {
    return this.request.get({
      url: 'rates/' + zip,
      params
    });
  }

  taxForOrder(params: TaxjarTypes.TaxParams): Promise<any> {
    return this.request.post({
      url: 'taxes',
      params
    });
  }

  listOrders(params?: TaxjarTypes.TransactionListParams): Promise<any> {
    return this.request.get({
      url: 'transactions/orders',
      params
    });
  }

  showOrder(transactionId: string): Promise<any> {
    return this.request.get({
      url: 'transactions/orders/' + transactionId
    });
  }

  createOrder(params: TaxjarTypes.CreateOrderParams): Promise<any> {
    return this.request.post({
      url: 'transactions/orders',
      params
    });
  }

  updateOrder(params: TaxjarTypes.UpdateOrderParams): Promise<any> {
    return this.request.put({
      url: 'transactions/orders/' + params.transaction_id,
      params
    });
  }

  deleteOrder(transactionId: string): Promise<any> {
    return this.request.delete({
      url: 'transactions/orders/' + transactionId
    });
  }

  listRefunds(params?: TaxjarTypes.TransactionListParams): Promise<any> {
    return this.request.get({
      url: 'transactions/refunds',
      params
    });
  }

  showRefund(transactionId: string): Promise<any> {
    return this.request.get({
      url: 'transactions/refunds/' + transactionId
    });
  }

  createRefund(params: TaxjarTypes.CreateRefundParams): Promise<any> {
    return this.request.post({
      url: 'transactions/refunds',
      params
    });
  }

  updateRefund(params: TaxjarTypes.UpdateRefundParams): Promise<any> {
    return this.request.put({
      url: 'transactions/refunds/' + params.transaction_id,
      params
    });
  }

  deleteRefund(transactionId: string): Promise<any> {
    return this.request.delete({
      url: 'transactions/refunds/' + transactionId
    });
  }

  listCustomers(params?: object): Promise<any> {
    return this.request.get({
      url: 'customers',
      params
    });
  }

  showCustomer(customerId: string): Promise<any> {
    return this.request.get({
      url: 'customers/' + customerId
    });
  }

  createCustomer(params: TaxjarTypes.CustomerParams): Promise<any> {
    return this.request.post({
      url: 'customers',
      params
    });
  }

  updateCustomer(params: TaxjarTypes.CustomerParams): Promise<any> {
    return this.request.put({
      url: 'customers/' + params.customer_id,
      params
    });
  }

  deleteCustomer(customerId: string): Promise<any> {
    return this.request.delete({
      url: 'customers/' + customerId
    });
  }

  nexusRegions(): Promise<any> {
    return this.request.get({
      url: 'nexus/regions'
    });
  }

  validateAddress(params: TaxjarTypes.AddressParams): Promise<any> {
    return this.request.post({
      url: 'addresses/validate',
      params
    });
  }

  validate(params: TaxjarTypes.ValidateParams): Promise<any> {
    return this.request.get({
      url: 'validation',
      params
    });
  }

  summaryRates(): Promise<any> {
    return this.request.get({
      url: 'summary_rates'
    });
  }
}

export = Taxjar;
