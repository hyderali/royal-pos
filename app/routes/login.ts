import { inject as service } from '@ember/service';
import EmberObject, { action } from '@ember/object';
import Route from '@ember/routing/route';
import { setProperties } from '@ember/object';
import SessionService from '../services/session';
import StoreService from '../services/store';
import RouterService from '@ember/routing/router-service';

interface LoginModel {
  username?: string;
  password?: string;
  error?: string;
}

interface LoginResponse {
  message: string;
  user: any;
  organization_id: string;
  org_name: string;
  org_address: string;
  org_phone: string;
  customer_id: string;
  inventory_account_id: string;
  cogs_id: string;
  names: string[];
  brands: string[];
  designs: string[];
  groups: string[];
  sizes: string[];
}

export default class LoginRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;
  @service declare router: RouterService;

  model(): LoginModel {
    return EmberObject.create({});
  }

  @action
  async login(): Promise<void> {
    const model = this.controllerFor('login').model as LoginModel;
    const { username, password } = model;
    const body = { username, password };
    
    model.error = '';
    
    const json = await this.store.ajax('/login', { method: 'POST', body }) as LoginResponse;
    
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
      model.error = json.message;
    }
  }
}