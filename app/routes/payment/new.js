import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import todayDate from '../../utils/today-date';

export default class PaymentNewRoute extends Route {
  @service session;
  @service store;

  queryParams = {
    invoiceids: {
      refreshModel: true
    }
  };

  serializeQueryParam(value, urlKey, defaultValueType) {
    if (urlKey === 'invoiceids' && value) {
      return value.join(',');
    }
    return super.serializeQueryParam(value, urlKey, defaultValueType);
  }

  deserializeQueryParam(value, urlKey, defaultValueType) {
    if (urlKey === 'invoiceids') {
      return value.split(',');
    }
    return super.deserializeQueryParam(value, urlKey, defaultValueType);
  }

  model(params) {
    const parentModel = this.modelFor('payment');
    let index = 0;
    return parentModel.filter((invoice) => {
      if (params.invoiceids.includes(invoice.invoice_id)) {
        invoice.discount = 0;
        invoice.credits_applied = 0;
        if (index === 0) {
          invoice.autofocus = true;
        }
        index++;
        return true;
      }
      return false;
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.credits = 0;
  }

  @action
  async saveAndRecordPayment() {
    const controller = this.controller;
    const invoices = controller.model;
    const credits = controller.credits;
    const customer_id = this.session.customer_id;
    const date = todayDate();

    const body = {
      customer_id: `${customer_id}`,
      date
    };

    let amount = 0;
    const serializedInvoices = [];

    invoices.forEach((invoice) => {
      const balance = invoice.balance;
      const credits_applied = invoice.credits_applied || 0;
      
      if (balance - credits_applied === 0) {
        return;
      }

      const discount_amount = invoice.discount || 0;
      const amount_applied = balance - discount_amount - credits_applied;
      amount += amount_applied;

      serializedInvoices.push({
        invoice_id: invoice.invoice_id,
        amount_applied,
        discount_amount
      });
    });

    if (credits && !amount) {
      controller.canShowPrint = true;
      this.printReceipt();
      this.goToList();
      return;
    }

    body.invoices = serializedInvoices;
    body.amount = amount;
    controller.isSaving = true;

    try {
      const json = await this.store.ajax('/payments', {
        method: 'POST',
        body
      });

      if (json.message === 'success') {
        controller.isSaving = false;
        controller.canShowPrint = true;
        this.printReceipt();
        this.goToList();
      }
    } catch (error) {
      controller.isSaving = false;
      console.error('Payment error:', error);
    }
  }

  @action
  async applyCredits() {
    const controller = this.controller;
    const selectedCreditNote = controller.selectedCreditNote;
    const model = controller.model;
    const { balance, creditnote_id } = selectedCreditNote;
    const invoices = [];

    controller.closeConfirmModal();
    controller.isApplyingCredits = true;
    controller.applyCreditsError = '';

    let remainingBalance = balance;

    for (const invoice of model) {
      const { balance: invbalance, invoice_id } = invoice;
      
      if (invbalance >= remainingBalance) {
        invoices.push({ 
          invoice_id, 
          amount_applied: remainingBalance, 
          apply_date: todayDate() 
        });
        remainingBalance = 0;
        break;
      }

      invoices.push({ 
        invoice_id, 
        amount_applied: invbalance, 
        apply_date: todayDate() 
      });
      remainingBalance -= invbalance;
    }

    if (remainingBalance) {
      controller.isApplyingCredits = false;
      controller.applyCreditsError = 'Enough Invoices Not Selected';
      return;
    }

    const body = { invoices };
    const params = { creditnote_id };

    try {
      const json = await this.store.ajax('/applycredits', {
        method: 'POST',
        body,
        params
      });

      if (json.message === 'success') {
        invoices.forEach((invoice) => {
          const moInvoice = model.findBy('invoice_id', invoice.invoice_id);
          moInvoice.credits_applied = invoice.amount_applied;
        });

        controller.credits = selectedCreditNote.balance;
        controller.isApplyingCredits = false;
        controller.closeModal();
      } else {
        controller.applyCreditsError = json.message;
      }
    } catch (error) {
      controller.applyCreditsError = error.message;
      controller.isApplyingCredits = false;
    }
  }

  @action
  printReceipt() {
    window.print();
  }

  @action
  goToList() {
    this.transitionTo('payment');
    this.send('reload');
    this.controller.canShowPrint = false;
  }
}