import { observes } from '@ember-decorators/object';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';
import Controller from '@ember/controller';

export default class PaymentController extends Controller {
  @observes('model.@each.selected')
  invoiceChecked() {
    let model = this.model || [];
    let selectedInvoices = model.filterBy('selected');
    if (isPresent(selectedInvoices)) {
      this.send('recordPayments', selectedInvoices.mapBy('invoice_id'));
    }
  }

  @action
  recordPaymentC(invoiceId) {
    this.send('recordPayment', invoiceId);
  }

  @action
  reloadC() {
    this.send('reload');
  }
}
