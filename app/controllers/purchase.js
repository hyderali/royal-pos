import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';

export default class PurchaseController extends Controller {
  @service session;
  @service store;

  @tracked vendor = null;
  @tracked newItemModel = null;
  @tracked printItems = null;
  @tracked nextNumber = '';
  @tracked isShowingModal = false;
  @tracked errorMessage = '';

  @computed('model.line_items.@each.{PurchaseRate,quantity}')
  get purchaseTotal() {
    const lineItems = this.model?.line_items || [];
    return lineItems.reduce((total, item) => {
      return total + (Number(item.PurchaseRate.split(' ')[1]) * (item.quantity || 1));
    }, 0);
  }

  @computed('model.line_items.@each.Rate')
  get salesTotal() {
    const lineItems = this.model?.line_items || [];
    return lineItems.reduce((total, item) => {
      return total + Number(item.Rate.split(' ')[1]);
    }, 0);
  }

  @computed('model.line_items.@each.quantity')
  get qtyTotal() {
    const lineItems = this.model?.line_items || [];
    return lineItems.reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0);
  }

  @computed('model.line_items.@each.sticker')
  get stickerTotal() {
    const lineItems = this.model?.line_items || [];
    return lineItems.reduce((total, item) => {
      return total + (Number(item.sticker) || 0);
    }, 0);
  }

  openNewItem(newItemModel, nextNumber, lineItem) {
    newItemModel.sku = nextNumber;
    if (lineItem) {
      Object.assign(newItemModel, {
        description: (lineItem['Item Name'] || '').split(' -')[0],
        group: lineItem.CF?.Group,
        purchase_rate: (lineItem.PurchaseRate || '').split(' ')[1],
        rate: (lineItem.Rate || '').split(' ')[1],
        discount: lineItem.CF?.Discount,
        size: lineItem.CF?.Size,
        design: lineItem.CF?.Design,
        brand: lineItem.CF?.Brand
      });
    }
    this.isShowingModal = true;
  }

  @action
  selectVendor(vendor) {
    this.model.vendor = vendor;
  }

  @action
  selectName(name) {
    this.newItemModel.description = name;
  }

  @action
  async createNameOnEnter(select, e) {
    const searchText = select.searchText;
    if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(searchText)) {
      const selected = this.newItemModel.description || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'names' };
        await this.store.ajax('/newattribute', { method: 'POST', body });
        this.session.groups.pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectGroup(group) {
    this.newItemModel.group = group;
  }

  @action
  async createGroupOnEnter(select, e) {
    const searchText = select.searchText;
    if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(searchText)) {
      const selected = this.newItemModel.group || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'groups' };
        await this.store.ajax('/newattribute', { method: 'POST', body });
        this.session.groups.pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectSize(size) {
    this.newItemModel.size = size;
  }

  @action
  async createSizeOnEnter(select, e) {
    const searchText = select.searchText;
    if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(searchText)) {
      const selected = this.newItemModel.size || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'sizes' };
        await this.store.ajax('/newattribute', { method: 'POST', body });
        this.session.sizes.pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectDesign(design) {
    this.newItemModel.design = design;
  }

  @action
  async createDesignOnEnter(select, e) {
    const searchText = select.searchText;
    if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(searchText)) {
      const selected = this.newItemModel.design || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'designs' };
        await this.store.ajax('/newattribute', { method: 'POST', body });
        this.session.designs.pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  selectBrand(brand) {
    this.newItemModel.brand = brand;
  }

  @action
  async createBrandOnEnter(select, e) {
    const searchText = select.searchText;
    if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(searchText)) {
      const selected = this.newItemModel.brand || '';
      if (!selected.includes(searchText)) {
        const body = { searchText, attribute: 'brands' };
        await this.store.ajax('/newattribute', { method: 'POST', body });
        this.session.brands.pushObject(searchText);
        select.actions.choose(searchText);
      }
    }
  }

  @action
  addNewItem(itemName) {
    const lineItems = this.model.line_items;
    const existingLineItem = lineItems.findBy('SKU', getItemName(itemName));
    const itemslist = this.session.itemslist;

    if (existingLineItem) {
      existingLineItem.quantity = Number(existingLineItem.quantity) + 1;
      return;
    }

    const newItem = itemslist.findBy('SKU', getItemName(itemName));
    if (newItem) {
      const rate = Number(newItem.Rate.split(' ')[1]);
      Object.assign(newItem, {
        rate,
        printRate: rate,
        quantity: 1,
        item_id: newItem['Item ID'],
        PurchaseRate: newItem['Purchase Rate']
      });
      lineItems.pushObject(newItem);
    }
  }

  @action
  async addItem(lineItem) {
    let nextNumber = this.nextNumber;
    const newItemModel = {};
    this.newItemModel = newItemModel;

    if (isBlank(nextNumber)) {
      const json = await this.store.ajax('/itemcustomfields');
      nextNumber = json.custom_fields.findBy('data_type', 'autonumber').value;
      this.openNewItem(newItemModel, nextNumber, lineItem);
    } else {
      this.openNewItem(newItemModel, nextNumber, lineItem);
    }
  }

  @action
  async saveItem() {
    const newItemModel = this.newItemModel;
    const { description, sku, rate, purchase_rate, group, discount, size, design, brand, colour } = newItemModel;
    
    const newItem = { 
      sku, 
      rate, 
      purchase_rate,
      name: `${description} - ${sku}`,
      description: `${description} ${size}`,
      custom_fields: [
        { label: 'Group', value: group },
        { label: 'Discount', value: discount },
        { label: 'Size', value: size },
        { label: 'Design', value: design },
        { label: 'Brand', value: brand },
        { label: 'Colour', value: colour }
      ],
      item_type: 'inventory',
      purchase_account_id: this.session.cogs_id,
      inventory_account_id: this.session.inventory_account_id
    };

    this.newItemModel.isSaving = true;

    try {
      const json = await this.store.ajax('/newitem', { 
        method: 'POST', 
        body: newItem 
      });

      if (json.message === 'success') {
        this.newItemModel = null;
        const newLineItem = {
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
            Size: size
          }
        };
        this.model.line_items.pushObject(newLineItem);
        this.isShowingModal = false;

        const newNextNumber = getItemName(`${Number(sku) + 1}`);
        this.nextNumber = newNextNumber;
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  }

  @action
  async save() {
    const model = this.model;
    const body = {
      vendor_id: model.vendor?.contact_id,
      bill_number: model.bill_number,
      line_items: model.line_items.map(lineItem => ({
        item_id: lineItem.item_id,
        quantity: lineItem.quantity,
        name: lineItem['Item Name'],
        description: lineItem.Description,
        account_id: this.session.inventory_account_id
      }))
    };

    const printItems = [];
    model.line_items.forEach(lineItem => {
      for (let i = 0; i < Number(lineItem.sticker); i++) {
        printItems.pushObject(lineItem);
      }
    });

    model.isSaving = true;
    this.errorMessage = '';

    try {
      const json = await this.store.ajax('/newbill', { 
        method: 'POST', 
        body 
      });

      if (json.message === 'success') {
        this.printItems = printItems;
        next(() => {
          schedule('afterRender', () => {
            window.print();
            this.send('reload');
          });
        });
      } else if (json.message === 'failure') {
        this.errorMessage = json.error;
      }
    } catch (error) {
      console.error('Error saving bill:', error);
    } finally {
      model.isSaving = false;
    }
  }

  @action
  closeModal() {
    this.isShowingModal = false;
  }

  @action
  removeLineItem(lineItem) {
    this.model.line_items.removeObject(lineItem);
  }

  @action
  purchaseRateChanged() {
    const profit = Number(this.newItemModel.profit) || 1;
    const rate = Number(this.newItemModel.purchase_rate);
    const salesRate = rate + ((rate * profit) / 100);
    this.newItemModel.rate = salesRate;
  }

  @action
  profitChanged() {
    const rate = Number(this.newItemModel.purchase_rate) || 1;
    const profit = Number(this.newItemModel.profit);
    const salesRate = rate + ((rate * profit) / 100);
    this.newItemModel.rate = salesRate;
  }
}