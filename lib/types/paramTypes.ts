export interface RateParams extends Record<string, string> {
  street?: string,
  city?: string,
  state?: string,
  country?: string
}

export interface NexusAddress {
  id?: string,
  country?: string,
  zip?: string,
  state?: string,
  city?: string,
  street?: string
}

export interface TaxLineItem {
  id?: string,
  quantity?: number,
  product_tax_code?: string,
  unit_price?: number,
  discount?: number
}

export interface LineItem extends TaxLineItem {
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
  exemption_type?: string,
  nexus_addresses?: NexusAddress[],
  line_items?: TaxLineItem[]
}

export interface TransactionListParams extends Record<string, string> {
  transaction_date?: string,
  from_transaction_date?: string,
  to_transaction_date?: string,
  provider?: string
}

export interface TransactionShowParams extends Record<string, string> {
  provider?: string
}

export interface TransactionDeleteParams extends TransactionShowParams {}

export interface CreateOrderParams {
  transaction_id: string,
  transaction_date: string,
  provider?: string,
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
  exemption_type?: string,
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
  exemption_type?: string,
  line_items?: LineItem[]
}

export interface CreateRefundParams {
  transaction_id: string,
  transaction_reference_id: string,
  transaction_date: string,
  provider?: string,
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
  exemption_type?: string,
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
  exemption_type?: string,
  line_items?: LineItem[]
}

export interface ExemptRegion {
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

export interface ValidateParams extends Record<string, string> {
  vat: string
}
