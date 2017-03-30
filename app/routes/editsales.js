import Ember from 'ember';
import todayDate from '../utils/today-date';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';
const { inject: { service } } = Ember;
export default Ember.Route.extend({
  session: service(),
  store: service(),
  beforeModel() {
    if (!this.get('session.itemslist')) {
      return this.get('store').ajax('/itemslist').then((json) => {
        this.set('session.itemslist', json.items);
        this.set('session.customer_id', json.customer_id);
        this.set('session.organization_id', json.organization_id);
      });
    }
  },
  setupController(controller) {
    controller.set('canShowDetails', false);
  },
  actions: {
    searchInvoice(invoice_number) {
      let params = {invoice_number};
      let controller = this.get('controller');
      controller.set('isSearching', true);
      this.get('store').ajax('/searchinvoice', {params}).then((json) => {
        if(json.message === 'success') {
          let model = Invoice.create({invoice_id: json.invoice.invoice_id, line_items: []});
          json.invoice.line_items.forEach(lineItem => {
            let newLineItem = LineItem.create(lineItem);
            newLineItem.set('discount', newLineItem.get('item_custom_fields').findBy('label', 'Discount').value);
            model.get('line_items').pushObject(newLineItem);
          });
          controller.setProperties({model, canShowDetails: true, isSearching: false});
        }
      });
    },
    addNewItem(itemName) {
      let lineItems = this.get('controller.model.line_items');
      var existingLineItem = lineItems.findBy('sku', itemName);
      let itemslist = this.get('session.itemslist');
      if(existingLineItem) {
        existingLineItem.set('quantity', existingLineItem.get('quantity')+1);
        return;
      }
      let newItem = itemslist.findBy('SKU', itemName);
      if (newItem) {
        let newLineItem = LineItem.create({
          discount: newItem.CF.Discount,
          item_custom_fields: [{label: 'Discount', value: newItem.CF.Discount}],
          rate: Number(newItem.Rate.split(' ')[1]),
          quantity: 1,
          name: newItem['Item Code'],
          sku: newItem.SKU,
          item_id: newItem['Item ID'],
          description: newItem.Description
        });
        lineItems.pushObject(newLineItem);
      }
    },
    removeLineItem(lineItem) {
      let lineItems = this.get('controller.model.line_items');
      lineItems.removeObject(lineItem);
    },
    saveAndPrint() {
      let model = this.get('controller.model');
      let customer_id = this.get('session.customer_id');
      let invoice_id = model.get('invoice_id');
      let params = {invoice_id};
      let date = todayDate();
      let body = { customer_id, date, due_date: date, discount: `${model.get('discountPercent')}%`,discount_type:'entity_level', is_discount_before_tax: false, adjustment: model.get('adjustment'), custom_fields: [ {label: 'Discount CF', value: model.get('discount')} ], reason: 'Update' };
      let lineItems = model.get('line_items');
      let serializedItems = lineItems.map((item) => {
        return {item_id: item.get('item_id'), rate: item.get('rate'), quantity: item.get('quantity'), item_custom_fields: item.get('item_custom_fields')};
      });
      body.line_items = serializedItems;
      model.set('isSaving', true);
      this.get('store').ajax('/updateinvoice', {method: 'POST', body, params}).then((json) => {
        if(json.message === 'success') {
          model.setProperties({
            invoice_number: json.invoice_number,
            canShowPrint: true,
            isSaving: false
          });
          Ember.run.schedule('afterRender', this, () => {
            this.send('printReceipt');
            this.send('printReceipt');
            this.send('newSale');
          });
        }
      });
    },
    printReceipt() {
      window.print();
    },
    newSale() {
      this.transitionTo('sales');
    }
  }
});
