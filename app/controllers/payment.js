import Ember from 'ember';
const { observer, isPresent } = Ember;
export default Ember.Controller.extend({
  invoiceChecked: observer('model.@each.selected', function() {
    let model = this.get('model') || [];
    let selectedInvoices = model.filterBy('selected');
    if (isPresent(selectedInvoices)) {
      this.send('recordPayments', selectedInvoices.mapBy('invoice_id'));
    }
  })
});
