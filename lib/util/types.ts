export namespace TaxjarTypes {
  export interface Config {
    apiKey: string,
    apiUrl?: string,
    headers?: object
  }

  interface RequestOptions {
    url: string,
    params?: object
  }

  export interface Request {
    get(options: RequestOptions): Promise<any>,
    post(options: RequestOptions): Promise<any>,
    put(options: RequestOptions): Promise<any>,
    delete(options: RequestOptions): Promise<any>
  }

  export interface RateParams {
    street?: string,
    city?: string,
    state?: string,
    country?: string
  }

  interface NexusAddress {
    id?: string,
    country?: string,
    zip?: string,
    state?: string,
    city?: string,
    street?: string
  }

  interface TaxLineItem {
    id?: string,
    quantity?: number,
    product_tax_code?: string,
    unit_price?: number,
    discount?: number
  }

  interface LineItem extends TaxLineItem {
    product_identifier?: string,
    description?: string,
    sales_tax?: number
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
    customer_id?: string,
    nexus_addresses?: NexusAddress[],
    line_items?: TaxLineItem[]
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
    customer_id?: string,
    line_items?: LineItem[]
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
    customer_id?: string,
    line_items?: LineItem[]
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
    customer_id?: string,
    line_items?: LineItem[]
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
    customer_id?: string,
    line_items?: LineItem[]
  }

  interface ExemptRegion {
    country?: string,
    state?: string
  }

  export interface CustomerParams {
    customer_id: string,
    exemption_type: string,
    exempt_regions?: ExemptRegion[],
    name: string,
    country?: string,
    state?: string,
    zip?: string,
    city?: string,
    street?: string
  }

  export interface AddressParams {
    country?: string,
    state?: string,
    zip?: string,
    city?: string,
    street?: string
  }

  export interface ValidateParams {
    vat: string
  }
}
