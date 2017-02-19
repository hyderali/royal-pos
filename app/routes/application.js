import Ember from 'ember';
const { inject: { service } } = Ember;
export default Ember.Route.extend({
  store: service(),
  session: service(),
  beforeModel() {
    if(!this.get('session.isLoggedIn')) {
      this.transitionTo('login');
    }
  },
  afterModel() {
    if (!this.get('session.itemslist')) {
      return this.get('store').ajax('/itemslist').then((json) => {
        this.set('session.itemslist', json.items);
        this.set('session.customer_id', json.customer_id);
        this.set('session.organization_id', json.organization_id);
      });
    }
  },
});
