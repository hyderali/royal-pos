import { observer } from '@ember/object';
import { isPresent } from '@ember/utils';
import Controller from '@ember/controller';
export default Controller.extend({
  invoiceChecked: observer('model.@each.selected', function() {
    let model = this.model || [];
    let selectedInvoices = model.filterBy('selected');
    if (isPresent(selectedInvoices)) {
      this.send('recordPayments', selectedInvoices.mapBy('invoice_id'));
    }
  })
});
