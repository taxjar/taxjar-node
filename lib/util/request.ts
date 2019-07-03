import * as requestPromise from 'request-promise-native';
import { TaxjarTypes } from './types';

const proxyError = (result): Error => {
  const proxiedError = new (<any>Error)(
    `TaxJar: ${result.error.error} - ${result.error.detail}`
  );
  proxiedError.error = result.error.error;
  proxiedError.detail = result.error.detail;
  proxiedError.status = result.statusCode;
  throw proxiedError;
};

export default (config: TaxjarTypes.Config): TaxjarTypes.Request => {
  const request = requestPromise.defaults({
    headers: Object.assign({}, config.headers || {}, {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }),
    baseUrl: config.apiUrl,
    json: true
  });

  return {
    get: options => request.get(options.url, {qs: options.params}).catch(proxyError),
    post: options => request.post(options.url, {body: options.params}).catch(proxyError),
    put: options => request.put(options.url, {body: options.params}).catch(proxyError),
    delete: options => request.delete(options.url, {qs: options.params}).catch(proxyError)
  };
};
