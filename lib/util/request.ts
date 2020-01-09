import * as requestPromise from 'request-promise-native';
import { Config, Request, TaxjarError } from '../util/types';

const proxyError = (result): never => {
  const isTaxjarError = result.statusCode && result.error && result.error.error && result.error.detail;

  if (isTaxjarError) {
    throw new TaxjarError(
      result.error.error,
      result.error.detail,
      result.statusCode
    );
  }

  throw result;
};

export default (config: Config): Request => {
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
