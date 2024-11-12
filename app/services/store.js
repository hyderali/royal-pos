import Service, { inject as service } from '@ember/service';

export default class StoreService extends Service {
  @service session;

  async ajax(requestUrl, options = {}) {
    const username = this.session.user?.username;
    const method = options.method || 'GET';
    const queryParams = new URLSearchParams({
      username,
      ...(options.params || {})
    });

    const requestOptions = { method };
    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
    }

    const url = `/api${requestUrl}?${queryParams}`;
    
    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(response.statusText);
    } catch (error) {
      throw error;
    }
  }
}