import Service, { inject as service } from '@ember/service';

export default class StoreService extends Service {
  @service
  session;

  ajax(requestUrl, options = {}) {
    let username = this.get('session.user.username') || '';
    let method = options.method || 'GET';
    let queryParams = {
      username,
    };
    Object.assign(queryParams, options.params || {});
    queryParams = Object.entries(queryParams)
      .map((pair) =>
        Array.isArray(pair[1])
          ? pair[1]
              .map(
                (x) =>
                  `${encodeURIComponent(pair[0])}[]=${encodeURIComponent(x)}`
              )
              .join('&')
          : typeof pair[1] === 'object'
          ? Object.entries(pair[1])
              .map(
                (x) =>
                  `${encodeURIComponent(pair[0])}[${x[0]}]=${encodeURIComponent(
                    x[1]
                  )}`
              )
              .join('&')
          : pair.map(encodeURIComponent).join('=')
      )
      .join('&');
    let requestOptions = { method };
    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
    }
    let url = `/api${requestUrl}?${queryParams}`;
    return window
      .fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            return json;
          });
        }
        let errorObj = { message: response.statusText };
        throw errorObj;
      })
      .catch((errorObj) => {
        throw errorObj;
      });
  }
}
