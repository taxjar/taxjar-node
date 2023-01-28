import fetch, { RequestInfo, RequestInit } from 'node-fetch';

import { Config, Request, TaxjarError } from './types';

const os = require('os');

const proxyError = (result: any): never => {
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
  const defaultOptions = {
    headers: Object.assign({}, config.headers || {}, {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': getUserAgent()
    }),
  };

  const getRequestBodyOptions = (body: object) => ({...defaultOptions, body: JSON.stringify(body)})

  const makeRequest = async (url: string, method: RequestInit['method'], queryParams?: Record<string, string>, options?: RequestInit): Promise<any> => {
    const requestUrl = new URL(url, config.apiUrl);
    if (queryParams) {
      requestUrl.search = new URLSearchParams(queryParams).toString();
    }

    const response = await fetch(requestUrl, { method, ...options });
  
    if (!response.ok) {
      const errorResponse = await response.text();

      const errorResult = { statusCode: response.status, error: errorResponse };
      try {
        // if there's JSON, attempt to parse it
        errorResult.error = JSON.parse(errorResponse);
      } catch (err) {
        // otherwise just use the raw text
      }

      proxyError(errorResult);
    }
  
    return response.json();
  }

  return {
    get: ({ url, params }) => makeRequest(url, 'GET', params, defaultOptions).catch(proxyError),
    post: ({ url, params }) => makeRequest(url, 'POST', undefined, getRequestBodyOptions(params)).catch(proxyError),
    put: ({ url, params }) => makeRequest(url, 'PUT', undefined, getRequestBodyOptions(params)).catch(proxyError),
    delete: ({ url, params }) => makeRequest(url, 'DELETE', params, defaultOptions).catch(proxyError)
  };
};
