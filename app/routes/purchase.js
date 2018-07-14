/* eslint camelcase: "off" */
import { inject as service } from '@ember/service';

import { isBlank } from '@ember/utils';
import Route from '@ember/routing/route';
import Object from '@ember/object';
export default Route.extend({
  store: service(),
  session: service(),
  beforeModel() {
    if (isBlank(this.get('session.vendors'))) {
      return this.store.ajax('/vendors').then((json) => {
        this.set('session.vendors', json.contacts);
      });
    }
  },
  model() {
    return Object.create({ line_items: [] });
  },
  actions: {
    reload() {
      this.set('controller.printItems', []);
      this.refresh();
    }
  }
});
