import { action, computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';

export default class NewController extends Controller {
  @controller('payment')
  paymentController;

  queryParams = ['invoiceids'];

  @computed('model.@each.balance')
  get total() {
    let model = this.model;
    let total = model.reduce((sum, item) => {
      return sum + Number(item.balance);
    }, 0);
    return total;
  }

  @computed('model.@each.discount')
  get discount() {
    let model = this.model;
    let total = model.reduce((sum, item) => {
      return sum + Number(item.discount || 0);
    }, 0);
    return total;
  }

  @computed('total', 'discount', 'credits')
  get totalPayable() {
    let total = this.total;
    let discount = Number(this.discount || 0);
    let credits = Number(this.credits || 0);
    return Math.round(total - discount - credits);
  }

  @computed('total', 'received', 'discount', 'credits')
  get balance() {
    let total = this.total;
    let received = Number(this.received || 0);
    let discount = Number(this.discount || 0);
    let credits = Number(this.credits || 0);
    return (received + discount + credits - total).toFixed(2);
  }

  @action
  showApplyCredits() {
    this.set('isShowingModal', true);
  }

  @action
  goToListC() {
    this.send('goToList');
  }

  @action
  saveAndRecordPaymentC() {
    this.send('saveAndRecordPayment');
  }
  @action
  applyCreditsC() {
    this.send('applyCredits');
  }

  @action
  closeModal() {
    this.set('isShowingModal', false);
  }

  @action
  closeConfirmModal() {
    this.setProperties({
      isShowingConfirmModal: false,
      selectedCreditNote: null,
    });
  }

  @action
  _applyCredits(creditNote) {
    this.setProperties({
      isShowingConfirmModal: true,
      selectedCreditNote: creditNote,
      isApplyingCredits: false,
      applyCreditsError: '',
    });
  }
}
