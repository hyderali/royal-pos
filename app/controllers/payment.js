import Ember from 'ember';
const { observer, isPresent, Controller } = Ember;
export default Controller.extend({
  invoiceChecked: observer('model.@each.selected', function() {
    let model = this.get('model') || [];
    let selectedInvoices = model.filterBy('selected');
    if (isPresent(selectedInvoices)) {
      this.send('recordPayments', selectedInvoices.mapBy('invoice_id'));
    }
  })
});
