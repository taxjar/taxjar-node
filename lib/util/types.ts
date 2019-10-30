export * from '../types/returnTypes';
export * from '../types/paramTypes';

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
  get (options: RequestOptions): Promise<any>,
  post (options: RequestOptions): Promise<any>,
  put (options: RequestOptions): Promise<any>,
  delete (options: RequestOptions): Promise<any>
}

export default interface TaxjarError extends Error {
  error: string,
  detail: string,
  status: number
}
