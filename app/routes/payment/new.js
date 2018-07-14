/* eslint camelcase: "off" */
import { set, get } from '@ember/object';

import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';
import todayDate from '../../utils/today-date';

export default Route.extend({
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
        set(invoice, 'credits_applied', 0);
        if (index === 0) {
          set(invoice, 'autofocus', true);
        }
        index++;
        return true;
      }
    });
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('credits', 0);
  },
  actions: {
    queryParamsDidChange() {
      this.refresh();
    },
    saveAndRecordPayment() {
      let controller = this.controller;
      let invoices = controller.model;
      let credits = controller.credits;
      let customer_id = this.get('session.customer_id');
      let date = todayDate();
      let body = {
        customer_id: `${customer_id}`,
        date
      };
      let amount = 0;
      let serializedInvoices = [];
      invoices.forEach((invoice) => {
        let balance = get(invoice, 'balance');
        let credits_applied = get(invoice, 'credits_applied') || 0;
        if (balance - credits_applied === 0) {
          return;
        }
        let discount_amount = get(invoice, 'discount') || 0;
        let amount_applied = balance - discount_amount - credits_applied;
        amount += amount_applied;
        serializedInvoices.push({
          invoice_id: get(invoice, 'invoice_id'),
          amount_applied,
          discount_amount
        });
      });
      if (credits && !amount) {
        controller.set('canShowPrint', true);
        schedule('afterRender', this, ()=> {
          this.send('printReceipt');
          this.send('goToList');
        });
        return;
      }
      body.invoices = serializedInvoices;
      body.amount = amount;
      this.set('controller.isSaving', true);
      this.store.ajax('/payments', {
        method: 'POST',
        body
      }).then((json) => {
        if (json.message === 'success') {
          controller.setProperties({ isSaving: false, canShowPrint: true });
          schedule('afterRender', this, ()=> {
            this.send('printReceipt');
            this.send('goToList');
          });
        }
      });
    },
    applyCredits() {
      let controller = this.controller;
      let selectedCreditNote = controller.selectedCreditNote;
      let model = controller.model;
      let { balance, creditnote_id } = selectedCreditNote;
      let invoices = [];
      controller.send('closeConfirmModal');
      controller.setProperties({ isApplyingCredits: true, applyCreditsError: '' });
      for (let i = 0, l = model.length; i < l; i++) {
        let invoice = model[i];
        let { balance: invbalance, invoice_id } = invoice;
        if (invbalance >= balance) {
          invoices.push({ invoice_id, amount_applied: balance, apply_date: todayDate() });
          balance -= balance;
          break;
        }
        invoices.push({ invoice_id, amount_applied: invbalance, apply_date: todayDate() });
        balance -= invbalance;
      }
      if (balance) {
        controller.setProperties({ isApplyingCredits: true, applyCreditsError: 'Enough Invoices Not Selected' });
        return;
      }
      let body = { invoices };
      let params = { creditnote_id };
      this.store.ajax('/applycredits', {
        method: 'POST',
        body,
        params
      }).then((json) => {
        if (json.message === 'success') {
          invoices.forEach((invoice) => {
            let moInvoice = model.findBy('invoice_id', invoice.invoice_id);
            set(moInvoice, 'credits_applied', invoice.amount_applied);
          });
          controller.set('credits', selectedCreditNote.balance);
          controller.set('isApplyingCredits', false);
          controller.send('closeModal');
        } else {
          controller.setProperties('applyCreditsError', json.message);
        }
      });
    },
    printReceipt() {
      window.print();
    },
    goToList() {
      this.transitionTo('payment');
      this.send('reload');
      this.set('controller.canShowPrint', false);
    }
  }
});
