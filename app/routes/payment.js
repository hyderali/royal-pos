import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
export default Route.extend({
  session: service(),
  store: service(),
  model() {
    return this.store.ajax('/invoiceslist').then((json) => {
      return json.invoices;
    });
  },
  setupController(controller) {
    this._super(...arguments);
    this.store.ajax('/creditnoteslist').then((json) => {
      controller.set('creditnotes', json.creditnotes);
    });
  },
  actions: {
    recordPayment(invoiceId) {
      this.transitionTo('payment.new', { queryParams: { invoiceids: [invoiceId] } });
    },
    recordPayments(invoiceIds) {
      this.transitionTo('payment.new', { queryParams: { invoiceids: invoiceIds } });
    },
    reload() {
      this.refresh();
    }
  }
});
