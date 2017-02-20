import Ember from 'ember';
import todayDate from '../../utils/today-date';
const { get, set, inject: { service }  } = Ember;

export default Ember.Route.extend({
  session: service(),
  store: service(),
  serializeQueryParam(value, urlKey, defaultValueType) {
    if (urlKey === 'invoiceids' && value) {
      return value.join(',');
    }
    return this._super(value, urlKey, defaultValueType);
  },
  deserializeQueryParam(value, urlKey, defaultValueType) {
    if (urlKey === 'invoiceids') {
      return value.split(',');
    }
    return this._super(value, urlKey, defaultValueType);
  },
  model(params) {
    let parentModel = this.modelFor('payment');
    let index = 0;
    return parentModel.filter((invoice) => {
      if (params.invoiceids.includes(invoice.invoice_id)) {
        set(invoice, 'discount', 0);
        if (index === 0) {
          set(invoice, 'autofocus', true);
        }
        index++;
        return true;
      }
    });
  },
  actions: {
    queryParamsDidChange() {
      this.refresh();
    },
    saveAndRecordPayment() {
      let invoices = this.get('controller.model');
      let customer_id = this.get('session.customer_id');
      let date = todayDate();
      let body = {
        customer_id: `${customer_id}`,
        date
      };
      let amount = 0;
      let serializedInvoices = invoices.map((invoice) => {
        let balance = get(invoice, 'balance');
        let discount_amount = get(invoice, 'discount') || 0;
        let amount_applied = balance - discount_amount;
        amount += amount_applied;
        return {
          invoice_id: get(invoice, 'invoice_id'),
          amount_applied,
          discount_amount
        };
      });
      body.invoices = serializedInvoices;
      body.amount = amount;
      this.set('controller.isSaving', true);
      this.get('store').ajax('/payments', {
        method: 'POST',
        body
      }).then((json) => {
        if (json.message === 'success') {
          this.set('session.payment_id', json.payment_id);
          this.set('controller.isSaving', false);
          this.send('printReceipt');
          this.send('goToList');
        }
      });
    },
    printReceipt() {
      let pdfUrl = `/api/paymentpdf?payment_id=${this.get('session.payment_id')}&authtoken=${this.get('session.user.authtoken')}`;
      let openedWindow = window.open(pdfUrl);
      openedWindow.onload = () => {
        Ember.run.later(this, () => {
          openedWindow.close();
        }, 1000);
      };
    },
    goToList() {
      this.transitionTo('payment');
      this.send('reload');
    }
  }
});
