import * as Promise from 'bluebird';
import Request from './util/request';
import { TaxjarTypes } from './util/types';

class Taxjar {
  public static DEFAULT_API_URL = 'https://api.taxjar.com';
  public static SANDBOX_API_URL = 'https://api.sandbox.taxjar.com';
  public static API_VERSION = 'v2';

  private config: TaxjarTypes.Config;
  private request: Request;

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

    this.request = new Request(this);
  }

  getApiConfig(index: string): any {
    return this.config[index];
  }

  setApiConfig(index: string, value: any): void {
    if (index === 'apiUrl') {
      value += '/' + Taxjar.API_VERSION + '/';
    }

    this.config[index] = value;
    this.request = new Request(this);
  }

  categories(): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'categories'
    });
  }

  ratesForLocation(zip: string, params?: TaxjarTypes.RateParams): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'rates/' + zip,
      query: params
    });
  }

  taxForOrder(params: TaxjarTypes.TaxParams): Promise<any> {
    return this.request.api({
      method: 'POST',
      url: 'taxes',
      data: params
    });
  }

  listOrders(params?: TaxjarTypes.TransactionListParams): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'transactions/orders',
      query: params
    });
  }

  showOrder(transactionId: string, params?: TaxjarTypes.TransactionShowParams): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'transactions/orders/' + transactionId,
      query: params
    });
  }

  createOrder(params: TaxjarTypes.CreateOrderParams): Promise<any> {
    return this.request.api({
      method: 'POST',
      url: 'transactions/orders',
      data: params
    });
  }

  updateOrder(params: TaxjarTypes.UpdateOrderParams): Promise<any> {
    return this.request.api({
      method: 'put',
      url: 'transactions/orders/' + params['transaction_id'],
      data: params
    });
  }

  deleteOrder(transactionId: string, params?: TaxjarTypes.TransactionDeleteParams): Promise<any> {
    return this.request.api({
      method: 'DELETE',
      url: 'transactions/orders/' + transactionId,
      query: params
    });
  }

  listRefunds(params?: TaxjarTypes.TransactionListParams): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'transactions/refunds',
      query: params
    });
  }

  showRefund(transactionId: string, params?: TaxjarTypes.TransactionShowParams): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'transactions/refunds/' + transactionId,
      query: params
    });
  }

  createRefund(params: TaxjarTypes.CreateRefundParams): Promise<any> {
    return this.request.api({
      method: 'POST',
      url: 'transactions/refunds',
      data: params
    });
  }

  updateRefund(params: TaxjarTypes.UpdateRefundParams): Promise<any> {
    return this.request.api({
      method: 'put',
      url: 'transactions/refunds/' + params['transaction_id'],
      data: params
    });
  }

  deleteRefund(transactionId: string, params?: TaxjarTypes.TransactionDeleteParams): Promise<any> {
    return this.request.api({
      method: 'DELETE',
      url: 'transactions/refunds/' + transactionId,
      query: params
    });
  }

  listCustomers(): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'customers'
    });
  }

  showCustomer(customerId: string): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'customers/' + customerId
    });
  }

  createCustomer(params: TaxjarTypes.CustomerParams): Promise<any> {
    return this.request.api({
      method: 'POST',
      url: 'customers',
      data: params
    });
  }

  updateCustomer(params: TaxjarTypes.CustomerParams): Promise<any> {
    return this.request.api({
      method: 'put',
      url: 'customers/' + params['customer_id'],
      data: params
    });
  }

  deleteCustomer(customerId: string): Promise<any> {
    return this.request.api({
      method: 'DELETE',
      url: 'customers/' + customerId
    });
  }

  nexusRegions(): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'nexus/regions'
    });
  }

  validateAddress(params: TaxjarTypes.AddressParams): Promise<any> {
    return this.request.api({
      method: 'POST',
      url: 'addresses/validate',
      data: params
    });
  }

  validate(params: TaxjarTypes.ValidateParams): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'validation',
      query: params
    });
  }

  summaryRates(): Promise<any> {
    return this.request.api({
      method: 'GET',
      url: 'summary_rates'
    });
  }
}

export = Taxjar;
