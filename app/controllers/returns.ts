import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import SessionService from '../services/session';
import LineItem from '../models/lineitem';

export default class ReturnsController extends Controller {
  @service declare session: SessionService;

  @action
  addNewItemC(itemName: string): void {
    this.send('addNewItem', itemName);
  }

  @action
  addTempItemC(): void {
    this.send('addTempItem');
  }

  @action
  removeLineItemC(lineItem: LineItem): void {
    this.send('removeLineItem', lineItem);
  }

  @action
  saveAndPrintC(): void {
    this.send('saveAndPrint');
  }

  @action
  newSaleC(): void {
    this.send('newSale');
  }
}