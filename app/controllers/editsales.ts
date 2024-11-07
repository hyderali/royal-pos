import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import SessionService from '../services/session';
import LineItem from '../models/lineitem';
import Invoice from '../models/invoice';

export default class EditsalesController extends Controller {
  @service declare session: SessionService;

  declare model: Invoice | null;
  declare msg: string;
  declare isSearching: boolean;
  declare canShowDetails: boolean;

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

  @action
  searchInvoiceC(invoiceNumber: string): void {
    this.send('searchInvoice', invoiceNumber);
  }
}