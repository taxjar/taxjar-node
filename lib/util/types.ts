export namespace TaxjarTypes {
  export interface Config {
    api_url: string,
    api_key: string
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
}
