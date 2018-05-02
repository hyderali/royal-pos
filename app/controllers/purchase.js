/* eslint camelcase: "off" */
import Ember from 'ember';
import getItemName from '../utils/get-item-name';
const {
  computed,
  inject: {
    service
  },
  isBlank,
  get,
  set,
  Controller,
  run: { schedule, next }
} = Ember;
export default Controller.extend({
  vendor: null,
  session: service(),
  store: service(),
  newItemModel: null,
  printItems: null,
  nextNumber: '',
  purchaseTotal: computed('model.line_items.@each.{PurchaseRate,quantity}', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += (Number(item.PurchaseRate.split(' ')[1]) * (item.quantity || 1));
    });
    return total;
  }),
  salesTotal: computed('model.line_items.@each.Rate', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.Rate.split(' ')[1]);
    });
    return total;
  }),
  qtyTotal: computed('model.line_items.@each.quantity', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.quantity) || 0;
    });
    return total;
  }),
  stickerTotal: computed('model.line_items.@each.sticker', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach((item) => {
      total += Number(item.sticker) || 0;
    });
    return total;
  }),
  actions: {
    selectVendor(vendor) {
      this.set('model.vendor', vendor);
    },
    selectGroup(group) {
      this.set('newItemModel.group', group);
    },
    createGroupOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('newItemModel.group') || '';
        if (!selected.includes(select.searchText)) {
          this.get('groups').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    selectSize(size) {
      this.set('newItemModel.size', size);
    },
    createSizeOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('newItemModel.size') || '';
        if (!selected.includes(select.searchText)) {
          this.get('sizes').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    selectDesign(design) {
      this.set('newItemModel.design', design);
    },
    createDesignOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('newItemModel.design') || '';
        if (!selected.includes(select.searchText)) {
          this.get('designs').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    selectBrand(brand) {
      this.set('newItemModel.brand', brand);
    },
    createBrandOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen
        && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('newItemModel.brand') || '';
        if (!selected.includes(select.searchText)) {
          this.get('brands').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },
    addNewItem(itemName) {
      let lineItems = this.get('model.line_items');
      let existingLineItem = lineItems.findBy('SKU', getItemName(itemName));
      let itemslist = this.get('session.itemslist');
      if (existingLineItem) {
        set(existingLineItem, 'quantity', Number(get(existingLineItem, 'quantity')) + 1);
        return;
      }
      let newItem = itemslist.findBy('SKU', getItemName(itemName));
      if (newItem) {
        let rate = Number(newItem.Rate.split(' ')[1]);
        newItem.rate = rate;
        newItem.printRate = rate,
        newItem.quantity = 1;
        newItem.item_id = newItem['Item ID'];
        newItem.PurchaseRate = newItem['Purchase Rate'];
        lineItems.pushObject(newItem);
      }
    },
    addItem() {
      let nextNumber = this.get('nextNumber');
      let newItemModel = {};
      this.set('newItemModel', newItemModel);
      if (isBlank(nextNumber)) {
        this.get('store').ajax('/itemcustomfields').then((json) => {
          nextNumber = json.custom_fields.findBy('data_type', 'autonumber').value;
          newItemModel.sku = nextNumber;
          this.set('isShowingModal', true);
        });
      } else {
        newItemModel.sku = nextNumber;
        this.set('isShowingModal', true);
      }
    },
    saveItem() {
      let newItemModel = this.get('newItemModel');
      let { description, sku, rate, purchase_rate, group, discount, size, design, brand, colour } = newItemModel;
      let newItem = { sku, rate, purchase_rate };
      newItem.name = `${description} - ${sku}`;
      newItem.description = `${description} ${size}`;
      let custom_fields = [
        { label: 'Group', value: group },
        { label: 'Discount', value: discount },
        { label: 'Size', value: size },
        { label: 'Design', value: design },
        { label: 'Brand', value: brand },
        { label: 'Colour', value: colour }
      ];
      newItem.custom_fields = custom_fields;
      newItem.item_type = 'inventory';
      newItem.purchase_account_id = this.get('session.cogs_id');
      newItem.inventory_account_id = this.get('session.inventory_account_id');
      let body = newItem;
      this.set('newItemModel.isSaving', true);
      this.get('store').ajax('/newitem', { method: 'POST', body }).then((json) => {
        if (json.message === 'success') {
          this.set('newItemModel', null);
          let newLineItem = {
            'Item Code': json.item.name,
            item_id: json.item.item_id,
            SKU: sku,
            Description: description,
            PurchaseRate: `INR ${purchase_rate}`,
            Rate: `INR ${rate}`,
            printRate: rate,
            CF: {
              Discount: discount,
              Brand: brand,
              Design: design,
              Size: size
            }
          };
          this.get('model.line_items').pushObject(newLineItem);
          this.set('isShowingModal', false);
          let newNextNumber = `${(Number(sku) + 1)}`;
          newNextNumber = getItemName(newNextNumber);
          this.set('nextNumber', newNextNumber);
        }
      });
    },
    save() {
      let model = this.get('model');
      let body = {};
      let lineItems = model.get('line_items');
      body.vendor_id = model.get('vendor.contact_id');
      body.bill_number = model.get('bill_number');
      body.line_items = lineItems.map((lineItem) => {
        return {
          item_id: lineItem.item_id,
          quantity: lineItem.quantity,
          name: lineItem['Item Code'],
          description: lineItem.Description,
          account_id: this.get('session.inventory_account_id')
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
      this.get('store').ajax('/newbill', { method: 'POST', body }).then((json) => {
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
    },
    closeModal() {
      this.set('isShowingModal', false);
    },
    removeLineItem(lineItem) {
      this.get('model.line_items').removeObject(lineItem);
    },
    purchaseRateChanged(rate) {
      let profit = Number(this.get('newItemModel.profit')) || 1;
      rate = Number(rate);
      let salesRate = rate + ((rate * profit) / 100);
      this.set('newItemModel.rate', salesRate);
    },
    profitChanged(profit) {
      let rate = Number(this.get('newItemModel.purchase_rate')) || 1;
      profit = Number(profit);
      let salesRate = rate + ((rate * profit) / 100);
      this.set('newItemModel.rate', salesRate);
    }
  }
});
