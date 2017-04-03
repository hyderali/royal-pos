import Ember from 'ember';
const { inject: { service }, Object, Route } = Ember;
export default Route.extend({
  session: service(),
  store: service(),
  model() {
    return Object.create();
  },
  actions: {
    login() {
      let model = this.get('controller.model');
      let { username, password } = model;
      let body = { username, password };
      model.set('error', '');
      this.get('store').ajax('/login', { method: 'POST', body }).then((json) => {
        if (json.message === 'success') {
          this.set('session.isLoggedIn', true);
          this.set('session.user', json.user);
          this.set('session.organization_id', json.organization_id);
          this.set('session.customer_id', json.customer_id);
          this.set('session.inventory_account_id', json.inventory_account_id);
          this.set('session.cogs_id', json.cogs_id);
          if (json.user.is_cash) {
            this.transitionTo('payment');
            return;
          }
          this.transitionTo('sales');
        } else {
          model.set('error', json.message);
        }
      });
    }
  }
});
