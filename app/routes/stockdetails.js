import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class StockDetailsRoute extends Route {
  @service session;
  @service store;

  async model() {
    if (this.session.itemCF) {
      return this.session.itemCF;
    }

    const json = await this.store.ajax('/itemcustomfields');
    this.session.itemCF = json.custom_fields;
    return json.custom_fields;
  }
}