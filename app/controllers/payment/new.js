import { computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
export default Controller.extend({
  paymentController: controller('payment'),
  queryParams: ['invoiceids'],
  total: computed('model.@each.balance', function() {
    let model = this.model;
    let total = model.reduce((sum, item)=> {
      return sum + Number(item.balance);
    }, 0);
    return total;
  }),
  discount: computed('model.@each.discount', function() {
    let model = this.model;
    let total = model.reduce((sum, item)=> {
      return sum + Number(item.discount || 0);
    }, 0);
    return total;
  }),
  totalPayable: computed('total', 'discount', 'credits', function() {
    let total = this.total;
    let discount = Number(this.discount || 0);
    let credits = Number(this.credits || 0);
    return Math.round(total - discount - credits);
  }),
  balance: computed('total', 'received', 'discount', 'credits', function() {
    let total = this.total;
    let received = Number(this.received || 0);
    let discount = Number(this.discount || 0);
    let credits = Number(this.credits || 0);
    return (received + discount + credits - total).toFixed(2);
  }),
  actions: {
    showApplyCredits() {
      this.set('isShowingModal', true);
    },
    closeModal() {
      this.set('isShowingModal', false);
    },
    closeConfirmModal() {
      this.setProperties({ isShowingConfirmModal: false, selectedCreditNote: null });
    },
    _applyCredits(creditNote) {
      this.setProperties({ isShowingConfirmModal: true, selectedCreditNote: creditNote, isApplyingCredits: false, applyCreditsError: '' });
    }
  }
});
