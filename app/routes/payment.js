import Ember from 'ember';
const { inject: { service }, Route } = Ember;
export default Route.extend({
  session: service(),
  store: service(),
  model() {
    return this.get('store').ajax('/invoiceslist').then((json) => {
      return json.invoices;
    });
  },
  setupController(controller) {
    this._super(...arguments);
    this.get('store').ajax('/creditnoteslist').then((json) => {
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
