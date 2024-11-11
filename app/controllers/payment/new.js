import Controller from '@ember/controller';
import { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { computed } from '@ember/object';

export default class PaymentNewController extends Controller {
  @controller('payment') paymentController;

  @tracked isShowingModal = false;
  @tracked isShowingConfirmModal = false;
  @tracked selectedCreditNote = null;
  @tracked isApplyingCredits = false;
  @tracked applyCreditsError = '';
  @tracked received = 0;
  @tracked credits = 0;

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
}