import Breakdown from './breakdown';

export interface CategoriesRes {
  categories: {
    product_tax_code: string,
    name: string,
    description: string
  }[]
}

export interface TaxForOrderRes {
  tax: {
    order_total_amount: number,
    shipping: number,
    taxable_amount: number,
    amount_to_collect: number,
    rate: number,
    has_nexus: boolean,
    freight_taxable: boolean,
    tax_source: string,
    exemption_type: string | null,
    jurisdictions: {
      country: string,
      state?: string,
      county?: string,
      city?: string
    }[]
    breakdown?: Breakdown
  }
}

export interface ListOrdersRes {
  orders: string[]
}

interface Order {
  transaction_id: string,
  user_id: number,
  transaction_date: string,
  transaction_reference_id: string | null,
  provider: string,
  exemption_type: string | null,
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
  line_items?: {
    id?: string,
    quantity?: number,
    product_identifier?: string,
    description?: string,
    product_tax_code?: string,
    unit_price?: number,
    discount?: number,
    sales_tax?: number
  }[]
}

export interface ShowOrderRes {
  order: Order
}

export interface CreateOrderRes extends ShowOrderRes {}

export interface UpdateOrderRes extends ShowOrderRes {}

interface DeletedOrder {
  transaction_id: string,
  user_id: number,
  provider: string,
  transaction_date: null,
  transaction_reference_id: null,
  exemption_type: null,
  from_country: null,
  from_zip: null,
  from_state: null,
  from_city: null,
  from_street: null,
  to_country: null,
  to_zip: null,
  to_state: null,
  to_city: null,
  to_street: null,
  amount: null,
  shipping: null,
  sales_tax: null,
  line_items: any[]
}

export interface DeleteOrderRes {
  order: DeletedOrder
}

export interface ListRefundsRes {
  refunds: string[]
}

interface Refund extends Order {}

export interface ShowRefundRes {
  refund: Refund
}

export interface CreateRefundRes extends ShowRefundRes {}

export interface UpdateRefundRes extends ShowRefundRes {}

export interface DeleteRefundRes {
  refund: DeletedOrder
}

export interface ListCustomersRes {
  customers: string[]
}

export interface ShowCustomerRes {
  customer: {
    customer_id: string,
    exemption_type: string,
    exempt_regions?: {
      country?: string,
      state?: string
    }[],
    name: string,
    country?: string,
    state?: string,
    zip?: string,
    city?: string,
    street?: string
  }
}

export interface CreateCustomerRes extends ShowCustomerRes {}

export interface UpdateCustomerRes extends ShowCustomerRes {}

export interface DeleteCustomerRes extends ShowCustomerRes {}

export interface RatesForLocationRes {
  rate: {
    zip?: string,
    country?: string,
    country_rate?: number,
    state?: string,
    state_rate?: number,
    county?: string,
    county_rate?: number,
    city?: string,
    city_rate?: number,
    combined_district_rate?: number,
    combined_rate?: number,
    freight_taxable: boolean

    // International attributes
    name?: string,
    standard_rate?: number,
    reduced_rate?: number,
    super_reduced_rate?: number,
    parking_rate?: number,
    distance_sale_threshold?: number
  }
}

export interface NexusRegionsRes {
  regions: {
    country_code: string,
    country: string,
    region_code: string,
    region: string
  }[]
}

export interface ValidateAddressRes {
  addresses: {
    country: string,
    state: string,
    zip: string,
    city: string,
    street?: string
  }[]
}

export interface ValidateRes {
  validation: {
    valid: boolean,
    exists: boolean,
    vies_available: boolean,
    vies_response: {
      country_code: string,
      vat_number: string,
      request_date: string,
      valid: boolean,
      name: string,
      address: string
    }
  }
}

export interface SummaryRatesRes {
  summary_rates: {
    country_code: string,
    country: string,
    region_code: string | null,
    region: string | null,
    minimum_rate: {
      label: string,
      rate: number
    },
    average_rate: {
      label: string,
      rate: number
    }
  }[]
}
