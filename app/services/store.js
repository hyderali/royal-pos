import { merge } from '@ember/polyfills';
import Service, { inject as service } from '@ember/service';
export default Service.extend({
  session: service(),
  ajax(requestUrl, options = {}) {
    let username = this.get('session.user.username');
    let method = options.method || 'GET';
    let queryParams = {
      username
    };
    merge(queryParams, (options.params || {}));
    queryParams = $.param(queryParams);
    let requestOptions = { method };
    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
    }
    let url = `/api${requestUrl}?${queryParams}`;
    return window.fetch(url, requestOptions).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          return json;
        });
      }
      let errorObj = { message: response.statusText };
      throw errorObj;
    }).catch((errorObj) => {
      throw errorObj;
    });
  }
});
