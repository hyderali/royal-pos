import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service session;
  @service store;
  @service router;

  @action
  async login(event) {
    event.preventDefault();
    const model = this.model;
    const { username, password } = model;
    const body = { username, password };

    model.set('error', '');

    try {
      const json = await this.store.ajax('/login', { method: 'POST', body });
      
      if (json.message === 'success') {
        this.session.setProperties({
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
          sizes: json.sizes
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
    } catch (error) {
      model.set('error', error.message);
    }
  }
}