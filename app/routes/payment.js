import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PaymentRoute extends Route {
  @service session;
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
  recordPayment(invoiceId) {
    this.transitionTo('payment.new', { queryParams: { invoiceids: [invoiceId] } });
  }

  @action
  recordPayments(invoiceIds) {
    this.transitionTo('payment.new', { queryParams: { invoiceids: invoiceIds } });
  }

  @action
  reload() {
    this.refresh();
  }
}