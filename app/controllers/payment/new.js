import Controller from '@ember/controller';
import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import todayDate from '../../utils/today-date';

export default class PaymentNewController extends Controller {
  @controller('payment') paymentController;
  @service session;
  @service store;
  @service router;

  @tracked isShowingModal = false;
  @tracked isShowingConfirmModal = false;
  @tracked selectedCreditNote = null;
  @tracked isApplyingCredits = false;
  @tracked applyCreditsError = '';
  @tracked received = 0;
  @tracked credits = 0;
  @tracked isSaving = false;
  @tracked canShowPrint = false;

  queryParams = ['invoiceids'];

  @computed('model.@each.balance')
  get total() {
    return this.model.reduce((sum, item) => sum + Number(item.balance), 0);
  }

  @computed('model.@each.discount')
  get discount() {
    return this.model.reduce((sum, item) => sum + Number(item.discount || 0), 0);
  }

  @computed('total', 'discount', 'credits')
  get totalPayable() {
    return Math.round(this.total - this.discount - this.credits);
  }

  @computed('total', 'received', 'discount', 'credits')
  get balance() {
    const total = this.total;
    const received = Number(this.received || 0);
    const discount = Number(this.discount || 0);
    const credits = Number(this.credits || 0);
    return (received + discount + credits - total).toFixed(2);
  }

  @computed('paymentController.creditnotes.@each.balance')
  get totalCredits() {
    return this.paymentController.creditnotes?.reduce((sum, note) => {
      return sum + Number(note.balance);
    }, 0) || 0;
  }

  @action
  showApplyCredits() {
    this.isShowingModal = true;
  }

  @action
  closeModal() {
    this.isShowingModal = false;
  }

  @action
  closeConfirmModal() {
    this.isShowingConfirmModal = false;
    this.selectedCreditNote = null;
  }

  @action
  _applyCredits(creditNote) {
    this.isShowingConfirmModal = true;
    this.selectedCreditNote = creditNote;
    this.isApplyingCredits = false;
    this.applyCreditsError = '';
  }

  @action
  async applyCredits() {
    const selectedCreditNote = this.selectedCreditNote;
    const model = this.model;
    const { balance, creditnote_id } = selectedCreditNote;
    const invoices = [];

    this.closeConfirmModal();
    this.isApplyingCredits = true;
    this.applyCreditsError = '';

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
      this.isApplyingCredits = false;
      this.applyCreditsError = 'Enough Invoices Not Selected';
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

        this.credits = selectedCreditNote.balance;
        this.isApplyingCredits = false;
        this.closeModal();
      } else {
        this.applyCreditsError = json.message;
      }
    } catch (error) {
      this.applyCreditsError = error.message;
      this.isApplyingCredits = false;
    }
  }

  @action
  async saveAndRecordPayment() {
    const invoices = this.model;
    const credits = this.credits;
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
      this.canShowPrint = true;
      this.printReceipt();
      this.goToList();
      return;
    }

    body.invoices = serializedInvoices;
    body.amount = amount;
    this.isSaving = true;

    try {
      const json = await this.store.ajax('/payments', {
        method: 'POST',
        body
      });

      if (json.message === 'success') {
        this.isSaving = false;
        this.canShowPrint = true;
        this.printReceipt();
        this.goToList();
      }
    } catch (error) {
      this.isSaving = false;
      console.error('Payment error:', error);
    }
  }

  @action
  printReceipt() {
    window.print();
  }

  @action
  goToList() {
    this.router.transitionTo('payment');
    this.send('reload');
    this.canShowPrint = false;
  }
}