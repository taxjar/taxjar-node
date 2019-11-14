import request from './util/request';
import * as TaxjarTypes from './util/types';

class Taxjar {
  public static DEFAULT_API_URL = 'https://api.taxjar.com';
  public static SANDBOX_API_URL = 'https://api.sandbox.taxjar.com';
  public static API_VERSION = 'v2';

  public static Error = TaxjarTypes.TaxjarError;

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

  categories(): Promise<TaxjarTypes.CategoriesRes> {
    return this.request.get({
      url: 'categories'
    });
  }

  taxForOrder(params: TaxjarTypes.TaxParams): Promise<TaxjarTypes.TaxForOrderRes> {
    return this.request.post({
      url: 'taxes',
      params
    });
  }

  listOrders(params?: TaxjarTypes.TransactionListParams): Promise<TaxjarTypes.ListOrdersRes> {
    return this.request.get({
      url: 'transactions/orders',
      params
    });
  }

  showOrder(transactionId: string, params?: TaxjarTypes.TransactionShowParams): Promise<TaxjarTypes.ShowOrderRes> {
    return this.request.get({
      url: 'transactions/orders/' + transactionId,
      params
    });
  }

  createOrder(params: TaxjarTypes.CreateOrderParams): Promise<TaxjarTypes.CreateOrderRes> {
    return this.request.post({
      url: 'transactions/orders',
      params
    });
  }

  updateOrder(params: TaxjarTypes.UpdateOrderParams): Promise<TaxjarTypes.UpdateOrderRes> {
    return this.request.put({
      url: 'transactions/orders/' + params.transaction_id,
      params
    });
  }

  deleteOrder(transactionId: string, params?: TaxjarTypes.TransactionDeleteParams): Promise<TaxjarTypes.DeleteOrderRes> {
    return this.request.delete({
      url: 'transactions/orders/' + transactionId,
      params
    });
  }

  listRefunds(params?: TaxjarTypes.TransactionListParams): Promise<TaxjarTypes.ListRefundsRes> {
    return this.request.get({
      url: 'transactions/refunds',
      params
    });
  }

  showRefund(transactionId: string, params?: TaxjarTypes.TransactionShowParams): Promise<TaxjarTypes.ShowRefundRes> {
    return this.request.get({
      url: 'transactions/refunds/' + transactionId,
      params
    });
  }

  createRefund(params: TaxjarTypes.CreateRefundParams): Promise<TaxjarTypes.CreateRefundRes> {
    return this.request.post({
      url: 'transactions/refunds',
      params
    });
  }

  updateRefund(params: TaxjarTypes.UpdateRefundParams): Promise<TaxjarTypes.UpdateRefundRes> {
    return this.request.put({
      url: 'transactions/refunds/' + params.transaction_id,
      params
    });
  }

  deleteRefund(transactionId: string, params?: TaxjarTypes.TransactionDeleteParams): Promise<TaxjarTypes.DeleteRefundRes> {
    return this.request.delete({
      url: 'transactions/refunds/' + transactionId,
      params
    });
  }

  listCustomers(): Promise<TaxjarTypes.ListCustomersRes> {
    return this.request.get({
      url: 'customers'
    });
  }

  showCustomer(customerId: string): Promise<TaxjarTypes.ShowCustomerRes> {
    return this.request.get({
      url: 'customers/' + customerId
    });
  }

  createCustomer(params: TaxjarTypes.CustomerParams): Promise<TaxjarTypes.CreateCustomerRes> {
    return this.request.post({
      url: 'customers',
      params
    });
  }

  updateCustomer(params: TaxjarTypes.CustomerParams): Promise<TaxjarTypes.UpdateCustomerRes> {
    return this.request.put({
      url: 'customers/' + params.customer_id,
      params
    });
  }

  deleteCustomer(customerId: string): Promise<TaxjarTypes.DeleteCustomerRes> {
    return this.request.delete({
      url: 'customers/' + customerId
    });
  }

  ratesForLocation (zip: string, params?: TaxjarTypes.RateParams): Promise<TaxjarTypes.RatesForLocationRes> {
    return this.request.get({
      url: 'rates/' + zip,
      params
    });
  }

  nexusRegions(): Promise<TaxjarTypes.NexusRegionsRes> {
    return this.request.get({
      url: 'nexus/regions'
    });
  }

  validateAddress(params: TaxjarTypes.AddressParams): Promise<TaxjarTypes.ValidateAddressRes> {
    return this.request.post({
      url: 'addresses/validate',
      params
    });
  }

  validate(params: TaxjarTypes.ValidateParams): Promise<TaxjarTypes.ValidateRes> {
    return this.request.get({
      url: 'validation',
      params
    });
  }

  summaryRates(): Promise<TaxjarTypes.SummaryRatesRes> {
    return this.request.get({
      url: 'summary_rates'
    });
  }
}

export = Taxjar;
