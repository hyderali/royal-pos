import NewCount from './newcount';
import Count from '../models/count';
import CountItem from '../models/countitem';

export default class EditcountRoute extends NewCount {
  templateName = 'newcount';
  controllerName = 'newcount';
  postUrl = '/updatecount';

  model(params) {
    return this.store.ajax('/editcount', { params }).then((json) => {
      return Count.create({
        isNew: false,
        countText: this.countText,
        count_id: json.count.count_id,
        items: json.count.items.map((item) =>
          CountItem.create({
            qty: item.qty,
            sku: item.sku,
            cost_price: item.cost_price,
            sales_price: item.sales_price,
            description: item.description,
          })
        ),
      });
    });
  }
}
