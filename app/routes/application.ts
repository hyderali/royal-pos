import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import SessionService from '../services/session';
import StoreService from '../services/store';
import RouterService from '@ember/routing/router-service';

export default class ApplicationRoute extends Route {
  @service declare store: StoreService;
  @service declare session: SessionService;
  @service declare router: RouterService;

  beforeModel(): void {
    if (!this.session.isLoggedIn) {
      this.router.transitionTo('login');
    }
  }

  async afterModel(): Promise<void> {
    if (!this.session.itemslist) {
      const json = await this.store.ajax('/itemslist');
      this.session.itemslist = json.items.filter((item: any) => item.Status === 'Active');
    }
  }
}