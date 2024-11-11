import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Invoice from '../models/invoice';

export default class SalesRoute extends Route {
  @service session;
  @service store;

  async beforeModel() {
    if (!this.session.salespersons) {
      const response = await this.store.ajax('/salespersons');
      this.session.salespersons = response.salespersons;
    }

    if (!this.session.itemslist) {
      const response = await this.store.ajax('/itemslist');
      this.session.itemslist = response.items.filter(item => item.Status === 'Active');
      this.session.customer_id = response.customer_id;
      this.session.organization_id = response.organization_id;
    }
  }

  model() {
    return Invoice.create({ line_items: [] });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.errorMessage = '';
  }
}