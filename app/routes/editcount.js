import NewCountRoute from './newcount';
import Count from '../models/count';
import CountItem from '../models/count-item';

export default class EditCountRoute extends NewCountRoute {
  templateName = 'newcount';
  postUrl = '/updatecount';

  async model(params) {
    const json = await this.store.ajax('/editcount', { params });

    return Count.create({
      isNew: false,
      countText: this.countText,
      count_id: json.count.count_id,
      items: json.count.items.map(item => CountItem.create({
        qty: item.qty,
        sku: item.sku,
        cost_price: item.cost_price,
        sales_price: item.sales_price,
        description: item.description
      }))
    });
  }
}