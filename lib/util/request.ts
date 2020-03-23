import * as requestPromise from 'request-promise-native';

import { Config, Request, TaxjarError } from '../util/types';

const os = require('os');

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

const getUserAgent = (): string => {
  const platform = os.version && os.version() || process.platform;
  const arch = os.arch();
  const nodeVersion = `${process.release.name} ${process.versions.node}`;
  const openSslVersion = `OpenSSL/${process.versions.openssl}`;
  const pkgVersion = `taxjar-node/${require('../../package.json').version}`;

  return `TaxJar/Node (${[platform, arch, nodeVersion, openSslVersion].join('; ')}) ${pkgVersion}`;
}

export default (config: Config): Request => {
  const request = requestPromise.defaults({
    headers: Object.assign({}, config.headers || {}, {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': getUserAgent()
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
