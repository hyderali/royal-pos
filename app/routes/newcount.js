import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import getItemName from '../utils/get-item-name';
import Count from '../models/count';
import CountItem from '../models/count-item';

export default class NewCountRoute extends Route {
  @service session;
  @service store;
  postUrl = '/newcount';

  async model() {
    const json = await this.store.ajax('/allcount');
    const count_id = getItemName(`${json.count.next_count_id}`);
    
    return Count.create({
      isNew: true,
      count_id: `Count-${count_id}`,
      items: []
    });
  }

  @action
  itemChanged(itemName) {
    itemName = getItemName(itemName);
    const { controller, controller: { model: { items } } } = this;
    const existingItem = items.findBy('sku', itemName);

    if (existingItem) {
      existingItem.qty = Number(existingItem.qty) + 1;
      controller.id = '';
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
    controller.id = '';
  }

  @action
  deleteItem(item) {
    this.controller.model.items.removeObject(item);
  }

  @action
  async save() {
    const { model, model: { items } } = this.controller;
    
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
      await this.store.ajax(this.postUrl, { method: 'POST', body });
      this.transitionTo('counting');
    } catch (error) {
      console.error('Error saving count:', error);
    }
  }

  @action
  cancel() {
    this.transitionTo('counting');
  }

  @action
  async delete() {
    const count_id = this.controller.model.count_id;
    
    if (window.confirm(`Are you sure about deleting this counting ${count_id}`)) {
      const body = { count_id };
      try {
        await this.store.ajax('/deletecount', { method: 'DELETE', body });
        this.transitionTo('counting');
      } catch (error) {
        console.error('Error deleting count:', error);
      }
    }
  }
}