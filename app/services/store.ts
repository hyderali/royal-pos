import Service, { inject as service } from '@ember/service';
import SessionService from './session';

interface RequestOptions {
  method?: string;
  params?: Record<string, any>;
  body?: any;
}

export default class StoreService extends Service {
  @service declare session: SessionService;

  async ajax(requestUrl: string, options: RequestOptions = {}): Promise<any> {
    const username = this.session.user?.username || '';
    const method = options.method || 'GET';
    const queryParams = {
      username,
      ...options.params,
    };

    const queryString = Object.entries(queryParams)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map(x => `${encodeURIComponent(key)}[]=${encodeURIComponent(x)}`)
            .join('&');
        } else if (typeof value === 'object' && value !== null) {
          return Object.entries(value)
            .map(([k, v]) => `${encodeURIComponent(key)}[${k}]=${encodeURIComponent(v)}`)
            .join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    const requestOptions: RequestInit = { method };
    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
    }

    const url = `/api${requestUrl}?${queryString}`;

    try {
      const response = await window.fetch(url, requestOptions);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(response.statusText);
    } catch (error) {
      throw error;
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'store': StoreService;
  }
}