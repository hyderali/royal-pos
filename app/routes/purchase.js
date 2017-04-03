/* eslint camelcase: "off" */
import Ember from 'ember';
const { inject: { service }, isBlank, Route, Object } = Ember;
export default Route.extend({
  store: service(),
  session: service(),
  beforeModel() {
    if (isBlank(this.get('session.vendors'))) {
      return this.get('store').ajax('/vendors').then((json) => {
        this.set('session.vendors', json.contacts);
      });
    }
  },
  model() {
    return Object.create({ line_items: [] });
  },
  actions: {
    reload() {
      this.set('printItems', []);
      this.refresh();
    }
  }
});
