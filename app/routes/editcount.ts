import NewCount from './newcount';
import Count from '../models/count';
import CountItem from '../models/countitem';

interface CountData {
  count: {
    count_id: string;
    items: Array<{
      qty: number;
      sku: string;
      cost_price: number;
      sales_price: number;
      description: string;
    }>;
  };
}

export default class EditcountRoute extends NewCount {
  templateName = 'newcount';
  controllerName = 'newcount';
  postUrl = '/updatecount';

  async model(params: { count_id: string }): Promise<Count> {
    const json = await this.store.ajax('/editcount', { params }) as CountData;
    
    return Count.create({
      isNew: false,
      countText: this.countText,
      count_id: json.count.count_id,
      items: json.count.items.map(item => 
        CountItem.create({
          qty: item.qty,
          sku: item.sku,
          cost_price: item.cost_price,
          sales_price: item.sales_price,
          description: item.description,
        })
      ),
    });
  }
}