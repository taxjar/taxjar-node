import * as Promise from 'bluebird';
import * as RequestPromise from 'request-promise';
import { TaxjarTypes } from './types';

export default class Request {
  private client: any;

  constructor(client) {
    this.client = client;
  }

  api(params: TaxjarTypes.RequestParams) {
    let self = this;

    return new Promise((resolve, reject) => {
      let options = Object.assign({
        uri: self.client.getApiConfig('api_url') + params.url,
        formData: JSON.stringify(params.data),
        qs: params.query,
        json: true
      }, params);

      options.headers = params.headers || {};
      options.headers['Authorization'] = 'Bearer ' + self.client.getApiConfig('api_key');
      options.headers['Content-Type'] = 'application/json';

      RequestPromise(options.uri, options).then(result => {
        resolve(result);
      }).catch(result => {
        let proxiedError = new (<any>Error)();
        proxiedError.error = result.error.error;
        proxiedError.detail = result.error.detail;
        proxiedError.status = result.statusCode;
        reject(proxiedError);
      });
    });
  }
}
