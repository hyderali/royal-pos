import Ember from 'ember';
const { inject: { service }, merge, Service } = Ember;
export default Service.extend({
  session: service(),
  ajax(requestUrl, options = {}) {
    let authtoken = this.get('session.user.authtoken');
    let method = options.method || 'GET';
    let queryParams = {
      authtoken
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
