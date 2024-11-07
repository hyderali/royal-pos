import { inject as service } from '@ember/service';

import { isBlank } from '@ember/utils';
import { set, get, setProperties, action, computed } from '@ember/object';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';

export default class PurchaseController extends Controller {
  vendor = null;

  @service
  session;

  @service
  store;

  newItemModel = null;
  printItems = null;
  nextNumber = '';

  @computed('model.line_items.@each.{PurchaseRate,quantity}')
  get purchaseTotal() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.PurchaseRate.split(' ')[1]) * (item.quantity || 1);
    });
    return total;
  }

  @computed('model.line_items.@each.Rate')
  get salesTotal() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.Rate.split(' ')[1]);
    });
    return total;
  }

  @computed('model.line_items.@each.quantity')
  get qtyTotal() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.quantity) || 0;
    });
    return total;
  }

  @computed('model.line_items.@each.sticker')
  get stickerTotal() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.sticker) || 0;
    });
    return total;
  }

  openNewItem(newItemModel, nextNumber, lineItem) {
    newItemModel.sku = nextNumber;
    if (lineItem) {
      setProperties(newItemModel, {
        description: (get(lineItem, 'Item Name') || '').split(' -')[0],
        group: get(lineItem, 'CF.Group'),
        purchase_rate: (lineItem.PurchaseRate || '').split(' ')[1],
        rate: (lineItem.Rate || '').split(' ')[1],
        discount: get(lineItem, 'CF.Discount'),
        size: get(lineItem, 'CF.Size'),
        design: get(lineItem, 'CF.Design'),
        brand: get(lineItem, 'CF.Brand'),
      });
    }
    this.set('isShowingModal', true);
  }

  @action
  selectVendor(vendor) {
    this.set('model.vendor', vendor);
  }

  @action
  selectName(name) {
    this.set('newItemModel.description', name);
  }

  @action
  createNameOnEnter(select, e) {
    let searchText = select.searchText;
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(searchText)
    ) {
      let selected = this.get('newItemModel.description') || '';
      if (!selected.includes(searchText)) {
        let body = { searchText, attribute: 'names' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.get('session.groups').pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectGroup(group) {
    this.set('newItemModel.group', group);
  }

  @action
  createGroupOnEnter(select, e) {
    let searchText = select.searchText;
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(searchText)
    ) {
      let selected = this.get('newItemModel.group') || '';
      if (!selected.includes(searchText)) {
        let body = { searchText, attribute: 'groups' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.get('session.groups').pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectSize(size) {
    this.set('newItemModel.size', size);
  }

  @action
  createSizeOnEnter(select, e) {
    let searchText = select.searchText;
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(searchText)
    ) {
      let selected = this.get('newItemModel.size') || '';
      if (!selected.includes(searchText)) {
        let body = { searchText, attribute: 'sizes' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.get('session.sizes').pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectDesign(design) {
    this.set('newItemModel.design', design);
  }

  @action
  createDesignOnEnter(select, e) {
    let searchText = select.searchText;
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(searchText)
    ) {
      let selected = this.get('newItemModel.design') || '';
      if (!selected.includes(searchText)) {
        let body = { searchText, attribute: 'designs' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.get('session.designs').pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectBrand(brand) {
    this.set('newItemModel.brand', brand);
  }

  @action
  createBrandOnEnter(select, e) {
    let searchText = select.searchText;
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(searchText)
    ) {
      let selected = this.get('newItemModel.brand') || '';
      if (!selected.includes(searchText)) {
        let body = { searchText, attribute: 'brands' };
        this.store.ajax('/newattribute', { method: 'POST', body });
        this.get('session.brands').pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  addNewItem(itemName) {
    let lineItems = this.get('model.line_items');
    let existingLineItem = lineItems.findBy('SKU', getItemName(itemName));
    let itemslist = this.get('session.itemslist');
    if (existingLineItem) {
      set(existingLineItem, 'quantity', Number(existingLineItem.quantity) + 1);
      return;
    }
    let newItem = itemslist.findBy('SKU', getItemName(itemName));
    if (newItem) {
      let rate = Number(newItem.Rate.split(' ')[1]);
      newItem.rate = rate;
      (newItem.printRate = rate), (newItem.quantity = 1);
      newItem.item_id = newItem['Item ID'];
      newItem.PurchaseRate = newItem['Purchase Rate'];
      lineItems.pushObject(newItem);
    }
  }

  @action
  addItem(lineItem) {
    let nextNumber = this.nextNumber;
    let newItemModel = {};
    this.set('newItemModel', newItemModel);
    if (isBlank(nextNumber)) {
      this.store.ajax('/itemcustomfields').then((json) => {
        nextNumber = json.custom_fields.findBy('data_type', 'autonumber').value;
        newItemModel.sku = nextNumber;
        this.openNewItem(newItemModel, nextNumber, lineItem);
      });
    } else {
      this.openNewItem(newItemModel, nextNumber, lineItem);
    }
  }

  @action
  saveItem() {
    let newItemModel = this.newItemModel;
    let {
      description,
      sku,
      rate,
      purchase_rate,
      group,
      discount,
      size,
      design,
      brand,
      colour,
    } = newItemModel;
    let newItem = { sku, rate, purchase_rate };
    newItem.name = `${description} - ${sku}`;
    newItem.description = `${description} ${size}`;
    let custom_fields = [
      { label: 'Group', value: group },
      { label: 'Discount', value: discount },
      { label: 'Size', value: size },
      { label: 'Design', value: design },
      { label: 'Brand', value: brand },
      { label: 'Colour', value: colour },
    ];
    newItem.custom_fields = custom_fields;
    newItem.item_type = 'inventory';
    newItem.purchase_account_id = this.get('session.cogs_id');
    newItem.inventory_account_id = this.get('session.inventory_account_id');
    let body = newItem;
    this.set('newItemModel.isSaving', true);
    this.store.ajax('/newitem', { method: 'POST', body }).then((json) => {
      if (json.message === 'success') {
        this.set('newItemModel', null);
        let newLineItem = {
          'Item Name': json.item.name,
          item_id: json.item.item_id,
          SKU: sku,
          Description: description,
          PurchaseRate: `INR ${purchase_rate}`,
          Rate: `INR ${rate}`,
          printRate: rate,
          CF: {
            Group: group,
            Discount: discount,
            Brand: brand,
            Design: design,
            Size: size,
          },
        };
        this.get('model.line_items').pushObject(newLineItem);
        this.set('isShowingModal', false);
        let newNextNumber = `${Number(sku) + 1}`;
        newNextNumber = getItemName(newNextNumber);
        this.set('nextNumber', newNextNumber);
      }
    });
  }

  @action
  save() {
    let model = this.model;
    let body = {};
    let lineItems = model.get('line_items');
    body.vendor_id = model.get('vendor.contact_id');
    body.bill_number = model.get('bill_number');
    body.line_items = lineItems.map((lineItem) => {
      return {
        item_id: lineItem.item_id,
        quantity: lineItem.quantity,
        name: lineItem['Item Name'],
        description: lineItem.Description,
        account_id: this.get('session.inventory_account_id'),
      };
    });
    let printItems = [];
    lineItems.forEach((lineItem) => {
      for (let i = 0; i < Number(lineItem.sticker); i++) {
        printItems.pushObject(lineItem);
      }
    });
    model.set('isSaving', true);
    this.set('errorMessage', '');
    this.store.ajax('/newbill', { method: 'POST', body }).then((json) => {
      if (json.message === 'success') {
        this.set('printItems', printItems);
        next(this, () => {
          schedule('afterRender', this, () => {
            window.print();
            this.send('reload');
          });
        });
      } else if (json.message === 'failure') {
        this.set('errorMessage', json.error);
      }
      model.set('isSaving', false);
    });
  }

  @action
  closeModal() {
    this.set('isShowingModal', false);
  }

  @action
  removeLineItem(lineItem) {
    this.get('model.line_items').removeObject(lineItem);
  }

  @action
  purchaseRateChanged() {
    let rate = this.newItemModel.purchase_rate;
    let profit = Number(this.get('newItemModel.profit')) || 1;
    rate = Number(rate);
    let salesRate = rate + (rate * profit) / 100;
    this.set('newItemModel.rate', salesRate);
  }

  @action
  profitChanged() {
    let profit = this.newItemModel.profit;
    let rate = Number(this.get('newItemModel.purchase_rate')) || 1;
    profit = Number(profit);
    let salesRate = rate + (rate * profit) / 100;
    this.set('newItemModel.rate', salesRate);
  }

  @action
  reloadC() {
    this.send('reload');
  }
}
