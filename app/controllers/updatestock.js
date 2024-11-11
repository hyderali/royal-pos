import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default class UpdateStockController extends Controller {
  @computed('model.[]')
  get total() {
    const items = this.model;
    let total = 0;
    
    items.forEach((item) => {
      total += Number(item['Incoming Stock']);
    });
    
    return total;
  }
}