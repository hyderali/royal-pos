import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';
import todayDate from '../utils/today-date';
import LineItem from '../models/line-item';
import Invoice from '../models/invoice';

export default class SalesRoute extends Route {
  @service session;
  @service store;

  postUrl = '/invoices';

  async beforeModel() {
    if (!this.session.salespersons) {
      const response = await this.store.ajax('/salespersons');
      this.session.salespersons = response.salespersons;
    }

    if (!this.session.itemslist) {
      const response = await this.store.ajax('/itemslist');
      this.session.itemslist = response.items.filter(item => item.Status === 'Active');
      this.session.customer_id = response.customer_id;
      this.session.organization_id = response.organization_id;
    }
  }

  model() {
    return Invoice.create({ line_items: [] });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.errorMessage = '';
  }

  processedBody() {
    const model = this.controller.model;
    const customer_id = this.session.customer_id;
    const date = todayDate();
    
    const body = {
      customer_id: `${customer_id}`,
      date,
      discount: `${model.discount}`,
      discount_type: 'entity_level',
      is_discount_before_tax: false,
      salesperson_id: model.salesperson?.salesperson_id,
      custom_fields: [{ 
        label: 'Phone Number', 
        value: model.phone_number 
      }]
    };

    const serializedItems = model.line_items.map(item => ({
      item_id: item.item_id,
      rate: item.rate,
      quantity: item.quantity,
      item_custom_fields: [{ 
        label: 'Discount', 
        value: item.discount 
      }],
      description: item.description
    }));

    body.line_items = serializedItems;
    model.isSaving = true;

    return body;
  }

  postResponse(json, skipPrint) {
    const model = this.controller.model;
    
    if (json.message === 'success') {
      if (skipPrint) {
        this.send('newSale');
        return;
      }

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
      this.controller.errorMessage = json.error;
      model.isSaving = false;
    }
  }

  @action
  addNewItem(itemName) {
    const lineItems = this.controller.model.line_items;
    const existingLineItem = lineItems.findBy('sku', itemName);
    const itemslist = this.session.itemslist;

    if (existingLineItem) {
      existingLineItem.quantity = existingLineItem.quantity + 1;
      return;
    }

    const newItem = itemslist.findBy('SKU', itemName);
    if (newItem) {
      const newLineItem = LineItem.create({
        discount: 0,
        rate: Number(newItem.Rate.split(' ')[1]),
        quantity: 1,
        name: newItem['Item Name'],
        sku: newItem.SKU,
        item_id: newItem['Item ID'],
        description: newItem.Description
      });
      lineItems.pushObject(newLineItem);
    }
  }

  @action
  addTempItem() {
    const lineItems = this.controller.model.line_items;
    const newLineItem = LineItem.create({
      description: 'Others',
      isCustom: true,
      canFocus: true,
      quantity: 1,
      rate: 0,
      discount: 0
    });
    lineItems.pushObject(newLineItem);
  }

  @action
  removeLineItem(lineItem) {
    const lineItems = this.controller.model.line_items;
    lineItems.removeObject(lineItem);
  }

  @action
  async saveAndPrint(skipPrint) {
    this.controller.errorMessage = '';
    const body = this.processedBody();
    
    try {
      const json = await this.store.ajax(this.postUrl, { 
        method: 'POST', 
        body 
      });
      this.postResponse(json, skipPrint);
    } catch (error) {
      this.controller.errorMessage = error.message;
      this.controller.model.isSaving = false;
    }
  }

  @action
  printReceipt() {
    window.print();
    window.print();
  }

  @action
  newSale() {
    this.refresh();
  }
}