export namespace TaxjarTypes {
  export interface Config {
    apiKey: string,
    apiUrl?: string
  }

  export interface RequestParams {
    method: string,
    url: string,
    data?: object,
    query?: object,
    headers?: object
  }

  export interface RateParams {
    street?: string,
    city?: string,
    state?: string,
    country?: string
  }

  export interface TaxParams {
    from_country?: string,
    from_zip?: string,
    from_state?: string,
    from_city?: string,
    from_street?: string,
    to_country: string,
    to_zip?: string,
    to_state?: string,
    to_city?: string,
    to_street?: string,
    amount?: number,
    shipping: number,
    nexus_addresses?: object,
    line_items?: object
  }

  export interface TransactionListParams {
    transaction_date?: string,
    from_transaction_date?: string,
    to_transaction_date?: string
  }

  export interface CreateOrderParams {
    transaction_id: string,
    transaction_date: string,
    from_country?: string,
    from_zip?: string,
    from_state?: string,
    from_city?: string,
    from_street?: string,
    to_country: string,
    to_zip: string,
    to_state: string,
    to_city?: string,
    to_street?: string,
    amount: number,
    shipping: number,
    sales_tax: number,
    line_items?: object
  }

  export interface UpdateOrderParams {
    transaction_id: string,
    transaction_date?: string,
    from_country?: string,
    from_zip?: string,
    from_state?: string,
    from_city?: string,
    from_street?: string,
    to_country?: string,
    to_zip?: string,
    to_state?: string,
    to_city?: string,
    to_street?: string,
    amount?: number,
    shipping?: number,
    sales_tax?: number,
    line_items?: object
  }

  export interface CreateRefundParams {
    transaction_id: string,
    transaction_reference_id: string,
    transaction_date: string,
    from_country?: string,
    from_zip?: string,
    from_state?: string,
    from_city?: string,
    from_street?: string,
    to_country: string,
    to_zip: string,
    to_state: string,
    to_city?: string,
    to_street?: string,
    amount: number,
    shipping: number,
    sales_tax: number,
    line_items?: object
  }

  export interface UpdateRefundParams {
    transaction_id: string,
    transaction_reference_id: string,
    transaction_date?: string,
    from_country?: string,
    from_zip?: string,
    from_state?: string,
    from_city?: string,
    from_street?: string,
    to_country?: string,
    to_zip?: string,
    to_state?: string,
    to_city?: string,
    to_street?: string,
    amount?: number,
    shipping?: number,
    sales_tax?: number,
    line_items?: object
  }

  export interface ValidateParams {
    vat: string
  }
}
