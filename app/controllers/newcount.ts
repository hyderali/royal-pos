import Controller from '@ember/controller';
import { action } from '@ember/object';
import CountItem from '../models/countitem';

export default class NewcountController extends Controller {
  @action
  deleteItemC(item: CountItem): void {
    this.send('deleteItem', item);
  }

  @action
  saveC(): void {
    this.send('save');
  }

  @action
  cancelC(): void {
    this.send('cancel');
  }

  @action
  deleteC(): void {
    this.send('delete');
  }

  @action
  itemChangedC(itemName: string): void {
    this.send('itemChanged', itemName);
  }
}