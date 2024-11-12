import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import getItemName from '../utils/get-item-name';
import CountItem from '../models/count-item';

export default class NewCountController extends Controller {
  @service session;
  @service store;
  @service router;
  @tracked id = '';

  @action
  itemChanged(itemName) {
    itemName = getItemName(itemName);
    const { model: { items } } = this;
    const existingItem = items.findBy('sku', itemName);

    if (existingItem) {
      existingItem.qty = Number(existingItem.qty) + 1;
      this.id = '';
      return;
    }

    const itemslist = this.session.itemslist;
    const newItem = itemslist.findBy('SKU', itemName);

    if (newItem) {
      const newLineItem = CountItem.create({
        qty: 1,
        sku: newItem.SKU,
        cost_price: Number(newItem['Purchase Rate'].split(' ')[1]),
        sales_price: Number(newItem.Rate.split(' ')[1]),
        description: newItem.Description
      });
      items.pushObject(newLineItem);
    }
    this.id = '';
  }

  @action
  deleteItem(item) {
    this.model.items.removeObject(item);
  }

  @action
  async save() {
    const { model, model: { items } } = this;
    
    const body = {
      count_id: model.count_id,
      items: items.map(item => ({
        qty: item.qty,
        sku: item.sku,
        cost_price: item.cost_price,
        cost_value: item.cost_value,
        sales_price: item.sales_price,
        sales_value: item.sales_value,
        description: item.description
      })),
      total: {
        qty: model.totalQty,
        cost_value: model.totalCV,
        sales_value: model.totalSV
      }
    };

    try {
      await this.store.ajax('/newcount', { method: 'POST', body });
      this.router.transitionTo('counting');
    } catch (error) {
      console.error('Error saving count:', error);
    }
  }

  @action
  cancel() {
    this.router.transitionTo('counting');
  }

  @action
  async delete() {
    const count_id = this.model.count_id;
    
    if (window.confirm(`Are you sure about deleting this counting ${count_id}`)) {
      const body = { count_id };
      try {
        await this.store.ajax('/deletecount', { method: 'DELETE', body });
        this.router.transitionTo('counting');
      } catch (error) {
        console.error('Error deleting count:', error);
      }
    }
  }
}