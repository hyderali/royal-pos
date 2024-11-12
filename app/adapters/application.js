import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  get headers() {
    return {
      'Content-Type': 'application/json'
    };
  }

  buildURL(modelName, id, snapshot, requestType, query) {
    let url = super.buildURL(...arguments);
    if (this.session.user?.username) {
      url += (url.includes('?') ? '&' : '?') + `username=${this.session.user.username}`;
    }
    return url;
  }
}