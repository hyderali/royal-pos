import { observes } from '@ember-decorators/object';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';
import Controller from '@ember/controller';

interface Invoice {
  invoice_id: string;
  selected?: boolean;
}

interface CreditNote {
  creditnote_id: string;
  creditnote_number: string;
  date_formatted: string;
  total_formatted: string;
  balance_formatted: string;
  balance: number;
}

export default class PaymentController extends Controller {
  declare model: Invoice[];
  declare creditnotes: CreditNote[];

  @observes('model.@each.selected')
  invoiceChecked(): void {
    const model = this.model || [];
    const selectedInvoices = model.filter(invoice => invoice.selected);
    if (isPresent(selectedInvoices)) {
      this.send('recordPayments', selectedInvoices.map(invoice => invoice.invoice_id));
    }
  }

  @action
  recordPaymentC(invoiceId: string): void {
    this.send('recordPayment', invoiceId);
  }

  @action
  reloadC(): void {
    this.send('reload');
  }
}