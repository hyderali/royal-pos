import { inject as service } from '@ember/service';

import { isBlank } from '@ember/utils';
import Route from '@ember/routing/route';
import Object, { action } from '@ember/object';

export default class PurchaseRoute extends Route {
  @service
  store;

  @service
  session;

  beforeModel() {
    if (isBlank(this.get('session.vendors'))) {
      return this.store.ajax('/vendors').then((json) => {
        this.set('session.vendors', json.contacts);
      });
    }
  }

  model() {
    return Object.create({ line_items: [] });
  }

  @action
  reload() {
    this.set('controller.printItems', []);
    this.refresh();
  }
}
