import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service store;
  @service router;

  async beforeModel() {
    if (!this.session.isLoggedIn) {
      this.router.transitionTo('login');
    }
  }

  async afterModel() {
    if (!this.session.itemslist) {
      const response = await this.store.ajax('/itemslist');
      this.session.itemslist = response.items?.filter(item => item.Status === 'Active');
    }
  }
}