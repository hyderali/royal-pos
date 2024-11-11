import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AddStockController extends Controller {
  @tracked total = 0;

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