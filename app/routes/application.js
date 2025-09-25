import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  @service
  store;

  @service
  session;

  @service router;

  beforeModel() {
    if (!this.get('session.isLoggedIn')) {
      this.router.transitionTo('login');
    }
  }

  afterModel() {
    if (!this.get('session.itemslist')) {
      return this.store.ajax('/itemslist').then((json) => {
        this.set('session.itemslist', json.items);
      });
    }
  }
}
