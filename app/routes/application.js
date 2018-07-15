import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
export default Route.extend({
  store: service(),
  session: service(),
  beforeModel() {
    if (!this.get('session.isLoggedIn')) {
      this.transitionTo('login');
    }
  },
  afterModel() {
    if (!this.get('session.itemslist')) {
      return this.store.ajax('/itemslist').then((json) => {
        this.set('session.itemslist', json.items.filterBy('Status', 'Active'));
        this.set('session.customer_id', json.customer_id);
        this.set('session.organization_id', json.organization_id);
      });
    }
  }
});
