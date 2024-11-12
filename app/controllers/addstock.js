import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import getItemName from '../utils/get-item-name';
import todayDate from '../utils/today-date';

export default class AddStockController extends Controller {
  @service store;
  @service session;
  
  @tracked items = [];
  @tracked total = 0;
  @tracked id = '';
  @tracked isSaving = false;
  @tracked errorMessage = '';

  @action
  itemChanged(itemName) {
    itemName = getItemName(itemName);
    const lineItems = this.items;
    const existingLineItem = lineItems.findBy('SKU', itemName);

    if (existingLineItem) {
      existingLineItem['Initial Stock'] = Number(existingLineItem['Initial Stock']) + 1;
      this.total = this.total + 1;
      this.id = '';
      return;
    }

    const itemslist = this.session.itemslist;
    const newItem = itemslist.findBy('SKU', itemName);

    if (newItem) {
      const newLineItem = {
        'Item Name': newItem['Item Name'],
        'SKU': newItem.SKU,
        'Description': newItem.Description,
        'Rate': newItem.Rate,
        'Product Type': 'goods',
        'Status': 'Active',
        'Purchase Rate': newItem['Purchase Rate'],
        'Purchase Account': 'Cost of Goods Sold',
        'Inventory Account': 'Inventory Asset',
        'Initial Stock': 1,
        'Initial Stock Rate': newItem['Purchase Rate'],
        'Item Type': 'Inventory',
        'Design': newItem.CF.Design || '',
        'Size': newItem.CF.Size || '',
        'Brand': newItem.CF.Brand || '',
        'Colour': newItem.CF.Colour || '',
        'Group': newItem.CF.Group || '',
        'Discount': newItem.CF.Discount || ''
      };
      lineItems.pushObject(newLineItem);
    }

    this.id = '';
    this.total = this.total + 1;
  }

  @action
  async save() {
    const body = {
      items: this.items,
      date: todayDate()
    };

    this.isSaving = true;
    this.errorMessage = '';

    try {
      const json = await this.store.ajax('/adjustment', { 
        method: 'POST', 
        body 
      });

      if (json.message === 'success') {
        this.items = [];
        this.id = '';
        this.total = 0;
      } else if (json.message === 'failure') {
        this.errorMessage = json.error;
      }
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.isSaving = false;
    }
  }

  @action
  removeLineItem(lineItem) {
    this.items.removeObject(lineItem);
  }

  @action
  computeTotal() {
    const items = this.items;
    let total = 0;
    
    items.forEach((item) => {
      total += Number(item['Initial Stock']);
    });
    
    this.total = total;
  }
}