import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import SessionService from '../services/session';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';

export default class SalesController extends Controller {
  @service declare session: SessionService;

  declare model: Invoice;
  declare errorMessage: string;

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
  saveAndPrintC(skipPrint: boolean): void {
    this.send('saveAndPrint', skipPrint);
  }

  @action
  newSaleC(): void {
    this.send('newSale');
  }
}