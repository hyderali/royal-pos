import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import getItemName from '../utils/get-item-name';
import Count from '../models/count';
import CountItem from '../models/countitem';
import SessionService from '../services/session';
import StoreService from '../services/store';
import RouterService from '@ember/routing/router-service';

interface CountResponse {
  count: {
    next_count_id: number;
  };
  message: string;
}

export default class NewcountRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;
  @service declare router: RouterService;

  postUrl = '/newcount';

  async model(): Promise<Count> {
    const json = await this.store.ajax('/allcount') as CountResponse;
    const count_id = getItemName(`${json.count.next_count_id}`);
    
    return Count.create({
      isNew: true,
      count_id: `Count-${count_id}`,
      items: [],
    });
  }

  @action
  itemChanged(itemName: string): void {
    const {
      controller,
      controller: {
        model: { items },
      },
    } = this;

    itemName = getItemName(itemName);
    const existingItem = items.find(item => item.sku === itemName);

    if (existingItem) {
      existingItem.qty = Number(existingItem.qty) + 1;
      controller.id = '';
      return;
    }

    const itemslist = this.session.itemslist;
    const newItem = itemslist?.find(item => item.SKU === itemName);

    if (newItem) {
      const newLineItem = CountItem.create({
        qty: 1,
        sku: newItem.SKU,
        cost_price: Number(newItem['Purchase Rate'].split(' ')[1]),
        sales_price: Number(newItem.Rate.split(' ')[1]),
        description: newItem.Description,
      });
      items.pushObject(newLineItem);
    }

    controller.id = '';
  }

  @action
  deleteItem(item: CountItem): void {
    const items = this.controller.model.items;
    items.removeObject(item);
  }

  @action
  async save(): Promise<void> {
    const {
      controller: {
        model,
        model: { items },
      },
    } = this;

    const body = {
      count_id: model.count_id,
      items: items.map(item => ({
        qty: item.qty,
        sku: item.sku,
        cost_price: item.cost_price,
        cost_value: item.cost_value,
        sales_price: item.sales_price,
        sales_value: item.sales_value,
        description: item.description,
      })),
      total: {
        qty: model.totalQty,
        cost_value: model.totalCV,
        sales_value: model.totalSV,
      },
    };

    await this.store.ajax(this.postUrl, { method: 'POST', body });
    this.router.transitionTo('counting');
  }

  @action
  cancel(): void {
    this.router.transitionTo('counting');
  }

  @action
  async delete(): void {
    const count_id = this.controller.model.count_id;
    
    if (window.confirm(`Are you sure about deleting this counting ${count_id}`)) {
      const body = { count_id };
      await this.store.ajax('/deletecount', { method: 'DELETE', body });
      this.router.transitionTo('counting');
    }
  }
}