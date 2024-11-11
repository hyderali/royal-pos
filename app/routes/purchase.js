import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Route from '@ember/routing/route';
import EmberObject from '@ember/object';

export default class PurchaseRoute extends Route {
  @service store;
  @service session;

  async beforeModel() {
    if (isBlank(this.session.vendors)) {
      const json = await this.store.ajax('/vendors');
      this.session.vendors = json.contacts;
    }
  }

  model() {
    return EmberObject.create({ line_items: [] });
  }

  @action
  reload() {
    this.controller.printItems = [];
    this.refresh();
  }
}