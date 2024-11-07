import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class UpdatestockController extends Controller {
  @computed('model.[]')
  get total() {
    let items = this.model;
    let total = 0;
    items.forEach((item) => {
      total += Number(item['Incoming Stock']);
    });
    return total;
  }

  @action
  saveC() {
    this.send('save');
  }
}
