/* eslint camelcase: "off" */
import Ember from 'ember';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';
import SalesRoute from './sales';
const { inject: { service } } = Ember;
export default SalesRoute.extend({
  session: service(),
  store: service(),
  setupController(controller) {
    controller.setProperties({ canShowDetails: false, model: null });
  },
  actions: {
    searchInvoice(invoice_number) {
      invoice_number = `INV-${invoice_number}`;
      let params = { invoice_number };
      let controller = this.get('controller');
      controller.setProperties({ msg: '', isSearching: true });
      this.get('store').ajax('/searchinvoice', { params }).then((json) => {
        if (json.message === 'success') {
          let salespersons = this.get('session.salespersons') || [];
          let salesperson = salespersons.findBy('salesperson_id', json.invoice.salesperson_id);
          let model = Invoice.create({ invoice_id: json.invoice.invoice_id, line_items: [] });
          model.set('salesperson', salesperson);
          json.invoice.line_items.forEach((lineItem) => {
            let newLineItem = LineItem.create(lineItem);
            let discountObj = newLineItem.get('item_custom_fields').findBy('label', 'Discount');
            if (discountObj) {
              newLineItem.set('discount', discountObj.value);
            }
            model.get('line_items').pushObject(newLineItem);
          });
          controller.setProperties({ model, canShowDetails: true, isSearching: false });
        } else {
          controller.setProperties({ msg: json.message, model: null, canShowDetails: false, isSearching: false });
        }
      });
    },
    saveAndPrint() {
      let body = this.processedBody();
      body.reason =  'Update';
      body.due_date =  body.date;
      let invoice_id = this.get('controller.model.invoice_id');
      let params = { invoice_id };
      this.get('store').ajax('/updateinvoice', { method: 'POST', body, params }).then((json) => {
        this.postResponse(json);
      });
    },
    newSale() {
      this.transitionTo('sales');
    }
  }
});
