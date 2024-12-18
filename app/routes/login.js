import { inject as service } from '@ember/service';
import Object, { action } from '@ember/object';
import Route from '@ember/routing/route';
import { setProperties } from '@ember/object';

export default class LoginRoute extends Route {
  @service
  session;

  @service
  store;

  @service router;

  model() {
    return Object.create();
  }

  @action
  login() {
    let model = this.get('controller.model');
    let { username, password } = model;
    let body = { username, password };
    model.set('error', '');
    this.store.ajax('/login', { method: 'POST', body }).then((json) => {
      if (json.message === 'success') {
        setProperties(this.session, {
          isLoggedIn: true,
          user: json.user,
          organization_id: json.organization_id,
          org_name: json.org_name,
          org_address: json.org_address,
          org_phone: json.org_phone,
          customer_id: json.customer_id,
          inventory_account_id: json.inventory_account_id,
          cogs_id: json.cogs_id,
          names: json.names,
          brands: json.brands,
          designs: json.designs,
          groups: json.groups,
          sizes: json.sizes,
        });
        document.title = json.org_name;
        if (json.user.is_cash) {
          this.router.transitionTo('payment');
          return;
        }
        this.router.transitionTo('sales');
      } else {
        model.set('error', json.message);
      }
    });
  }
}
