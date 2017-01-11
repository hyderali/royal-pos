import Ember from 'ember';
const { inject: { service } } = Ember;
export default Ember.Route.extend({
  session: service(),
  store: service(),
  model() {
    return this.get('store').ajax('/invoiceslist').then((json) => {
      return json.invoices;
    });
  },
  actions: {
    recordPayment(invoiceId) {
      this.transitionTo('payment.new', {queryParams: {invoiceids: [invoiceId]}});
    },
    recordPayments(invoiceIds) {
      this.transitionTo('payment.new', {queryParams: {invoiceids: invoiceIds}});
    },
    reload() {
      this.refresh();
    }
  }
});
