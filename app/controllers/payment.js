import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PaymentController extends Controller {
  @tracked creditnotes;

  @action
  recordPayment(invoiceId) {
    this.router.transitionTo('payment.new', { queryParams: { invoiceids: [invoiceId] } });
  }

  @action
  recordPayments(invoiceIds) {
    this.router.transitionTo('payment.new', { queryParams: { invoiceids: invoiceIds } });
  }

  @action
  reload() {
    this.send('reload');
  }
}