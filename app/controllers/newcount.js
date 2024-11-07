import Controller from '@ember/controller';
import { action } from '@ember/object';
export default class NewcountController extends Controller {
  @action
  deleteItemC(item) {
    this.send('deleteItem', item);
  }

  @action
  saveC(item) {
    this.send('save');
  }

  @action
  cancelC(item) {
    this.send('cancel');
  }

  @action
  deleteC(item) {
    this.send('delete');
  }

  @action
  itemChangedC(itemName) {
    this.send('itemChanged', itemName);
  }
}
