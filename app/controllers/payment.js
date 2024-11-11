import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PaymentController extends Controller {
  @service store;
  @tracked creditnotes;

  @action
  recordPayment(invoiceId) {
    this.router.transitionTo('payment.new', { queryParams: { invoiceids: [invoiceId] } });
  }

  @action
  recordPayments(invoiceIds) {
    this.router.transitionTo('payment.new', { queryParams: { invoiceids: invoiceIds } });
  }

  @action
  async reload() {
    const model = await this.store.ajax('/invoiceslist');
    this.model = model.invoices;
    
    const creditNotesResponse = await this.store.ajax('/creditnoteslist');
    this.creditnotes = creditNotesResponse.creditnotes;
  }
}