import Route from '@ember/routing/route';
import Count from '../models/count';
import getItemName from '../utils/get-item-name';

export default class NewCountRoute extends Route {
  async model() {
    const json = await this.store.ajax('/allcount');
    const count_id = getItemName(`${json.count.next_count_id}`);
    
    return Count.create({
      isNew: true,
      count_id: `Count-${count_id}`,
      items: []
    });
  }
}