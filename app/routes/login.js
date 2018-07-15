import { inject as service } from '@ember/service';
import Object from '@ember/object';
import Route from '@ember/routing/route';
import { setProperties } from '@ember/object';
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
      this.store.ajax('/login', { method: 'POST', body }).then((json) => {
        if (json.message === 'success') {
          setProperties(this.get('session'), {
            isLoggedIn: true,
            user: json.user,
            organization_id: json.organization_id,
            customer_id: json.customer_id,
            inventory_account_id: json.inventory_account_id,
            cogs_id: json.cogs_id,
            brands: json.brands,
            designs: json.designs,
            groups: json.groups,
            sizes: json.sizes
          });
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
