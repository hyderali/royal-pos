/* eslint camelcase: "off" */
import Ember from 'ember';
import todayDate from '../utils/today-date';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';
const { inject: { service }, Route, run: { schedule } } = Ember;
export default Route.extend({
  session: service(),
  store: service(),
  postUrl: '/invoices',
  beforeModel() {
    if (!this.get('session.salespersons')) {
      this.get('store').ajax('/salespersons').then((json) => {
        this.set('session.salespersons', json.salespersons);
      });
    }
    if (!this.get('session.itemslist')) {
      return this.get('store').ajax('/itemslist').then((json) => {
        this.set('session.itemslist', json.items.filterBy('Status', 'Active'));
        this.set('session.customer_id', json.customer_id);
        this.set('session.organization_id', json.organization_id);
      });
    }
  },
  model() {
    return Invoice.create({ line_items: [] });
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('errorMessage', '');
  },
  processedBody() {
    let model = this.get('controller.model');
    let customer_id = this.get('session.customer_id');
    let date = todayDate();
    let body = { customer_id: `${customer_id}`, date, discount: `${model.get('discount')}`, discount_type: 'entity_level', is_discount_before_tax: false, salesperson_id: model.get('salesperson.salesperson_id'), custom_fields: [{ label: 'Phone Number', value: model.get('phone_number') }] };
    let lineItems = model.get('line_items');
    let serializedItems = lineItems.map((item) => {
      return { item_id: item.get('item_id'), rate: item.get('rate'), quantity: item.get('quantity'), item_custom_fields: item.get('item_custom_fields') };
    });
    body.line_items = serializedItems;
    model.set('isSaving', true);
    return body;
  },
  postResponse(json) {
    let model = this.get('controller.model');
    if (json.message === 'success') {
      model.setProperties({
        entity_number: json.entity_number,
        canShowPrint: true,
        isSaving: false
      });
      schedule('afterRender', this, () => {
        this.send('printReceipt');
        this.send('newSale');
      });
    } else {
      this.set('controller.errorMessage', json.error);
      model.set('isSaving', false);
    }
  },
  actions: {
    addNewItem(itemName) {
      let lineItems = this.get('controller.model.line_items');
      let existingLineItem = lineItems.findBy('sku', itemName);
      let itemslist = this.get('session.itemslist');
      if (existingLineItem) {
        existingLineItem.set('quantity', existingLineItem.get('quantity') + 1);
        return;
      }
      let newItem = itemslist.findBy('SKU', itemName);
      if (newItem) {
        let newLineItem = LineItem.create({
          discount: newItem.CF.Discount,
          item_custom_fields: [{ label: 'Discount', value: newItem.CF.Discount }], rate: Number(newItem.Rate.split(' ')[1]),
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
      this.set('controller.errorMessage', '');
      let body = this.processedBody();
      this.get('store').ajax(this.get('postUrl'), { method: 'POST', body }).then((json) => {
        this.postResponse(json);
      });
    },
    printReceipt() {
      window.print();
      window.print();
    },
    newSale() {
      this.refresh();
    }
  }
});
