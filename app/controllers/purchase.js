import Ember from 'ember';
const {
  computed,
  inject: {
    service
  },
  isBlank
} = Ember;
export default Ember.Controller.extend({
  vendor: null,
  session: service(),
  store: service(),
  newItemModel: null,
  printItems: null,
  nextNumber: '',
  purchaseTotal: computed('model.line_items.@each.{PurchaseRate,quantity}', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach(item => {
      total += (Number(item.PurchaseRate.split(' ')[1]) * (item.quantity || 1));
    });
    return total;
  }),
  salesTotal: computed('model.line_items.@each.Rate', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach(item => {
      total += Number(item.Rate.split(' ')[1]);
    });
    return total;
  }),
  qtyTotal: computed('model.line_items.@each.quantity', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach(item => {
      total += Number(item.quantity) || 0;
    });
    return total;
  }),
  stickerTotal: computed('model.line_items.@each.sticker', function() {
    let lineItems = this.get('model.line_items') || [];
    let total = 0;
    lineItems.forEach(item => {
      total += Number(item.sticker) || 0;
    });
    return total;
  }),
  actions: {
    selectVendor(vendor) {
      this.set('model.vendor', vendor);
    },
    addNewItem(itemName) {
      let lineItems = this.get('model.line_items');
      var existingLineItem = lineItems.findBy('sku', itemName);
      let itemslist = this.get('session.itemslist');
      if(existingLineItem) {
        existingLineItem.set('quantity', existingLineItem.get('quantity')+1);
        return;
      }
      let newItem = itemslist.findBy('SKU', itemName);
      if (newItem) {
        newItem.rate = Number(newItem.Rate.split(' ')[1]);
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
      let {description, sku, rate, purchase_rate, group, discount, size, design, brand, colour} = newItemModel;
      let newItem = {sku, rate, purchase_rate};
      newItem.name = `${description} - ${sku}`;
      newItem.description = `${description} ${size}`;
      let custom_fields = [
        {label : 'Group', value: group},
        {label : 'Discount', value: discount},
        {label : 'Size', value: size},
        {label : 'Design', value: design},
        {label : 'Brand', value: brand},
        {label : 'Colour', value: colour}
      ];
      newItem.custom_fields = custom_fields;
      newItem.item_type = 'inventory';
      newItem.purchase_account_id = this.get('session.cogs_id');
      newItem.inventory_account_id = this.get('session.inventory_account_id');
      let body = newItem;
      this.set('newItemModel.isSaving', true);
      this.get('store').ajax('/newitem', {method: 'POST', body}).then((json) => {
        if(json.message === 'success') {
          this.set('newItemModel', null);
          let newLineItem = {SKU: sku, Description: description, PurchaseRate: `INR ${purchase_rate}`, Rate: `INR ${rate}`, CF: {Discount: discount, Brand: brand, Design: design, Size: size}};
          this.get('model.line_items').pushObject(newLineItem);
          this.set('isShowingModal', false);
          let newNextNumber = `${(Number(sku) + 1)}`;
          let length = newNextNumber.length;
          for (let i=length;i<9;i++ ) {
            newNextNumber = `0${newNextNumber}`;
          }
          this.set('nextNumber', newNextNumber);
          this.set('newItemModel.isSaving', false);
        }
      });
    },
    save() {
      let model = this.get('model');
      let body = {};
      let lineItems = model.get('line_items');
      body.vendor_id = model.get('vendor.contact_id');
      body.bill_number = model.get('bill_number');
      body.line_items = lineItems.map(lineItem => {
        return {
          item_id: lineItem.item_id,
          quantity: lineItem.quantity,
          name: lineItem['Item Code'],
          description: lineItem.Description,
          account_id: this.get('session.inventory_account_id')
        };
      });
      let printItems = [];
      lineItems.forEach(lineItem => {
        for(let i =0; i<Number(lineItem.sticker);i++) {
          printItems.pushObject(lineItem);
        }
      });
      model.set('isSaving', true);
      this.get('store').ajax('/newbill', {method: 'POST', body}).then((json) => {
        if(json.message === 'success') {
          this.set('printItems', printItems);
          Ember.run.next(this, () => {
            Ember.run.schedule('afterRender', this, () => {
              window.print();
            });
          });
        }
      });
    },
    closeModal() {
      this.set('isShowingModal', false);
    },
    removeLineItem(lineItem) {
      this.get('model.line_items').removeObject(lineItem);
    }
  }
});
