export * from '../types/returnTypes';
export * from '../types/paramTypes';

export interface Config {
  apiKey: string,
  apiUrl?: string,
  headers?: object
}

interface QueryRequestOptions {
  url: string,
  params?: Record<string, string>
}

interface BodyRequestOptions {
  url: string,
  params?: object
}

export interface Request {
  get (options: QueryRequestOptions): Promise<any>,
  post (options: BodyRequestOptions): Promise<any>,
  put (options: BodyRequestOptions): Promise<any>,
  delete (options: QueryRequestOptions): Promise<any>
}

export class TaxjarError extends Error {
  constructor(
    public error: string,
    public detail: string,
    public status: number
  ) {
    super(`${error} - ${detail}`);
  }
}
 
Object.defineProperty(TaxjarError.prototype, 'name', {
  value: 'TaxjarError',
  configurable: true,
  writable: true
});
