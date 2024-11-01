import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class PaymentRoute extends Route {
  @service
  session;

  @service
  store;

  @service router;

  model() {
    return this.store.ajax('/invoiceslist').then((json) => {
      return json.invoices;
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    this.store.ajax('/creditnoteslist').then((json) => {
      controller.set('creditnotes', json.creditnotes);
    });
  }

  @action
  recordPayment(invoiceId) {
    this.router.transitionTo('payment.new', {
      queryParams: { invoiceids: [invoiceId] },
    });
  }

  @action
  recordPayments(invoiceIds) {
    this.router.transitionTo('payment.new', {
      queryParams: { invoiceids: invoiceIds },
    });
  }

  @action
  reload() {
    this.refresh();
  }
}
