import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class PaymentRoute extends Route {
  @service store;

  async model() {
    const json = await this.store.ajax('/invoiceslist');
    return json.invoices;
  }

  async setupController(controller) {
    super.setupController(...arguments);
    
    const json = await this.store.ajax('/creditnoteslist');
    controller.creditnotes = json.creditnotes;
  }

  @action
  refreshAction(){
    this.refresh();
  }
}