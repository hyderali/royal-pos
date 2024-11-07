import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
export default class ReturnsController extends Controller {
  @service
  session;
  @action
  addNewItemC(itemName) {
    this.send('addNewItem', itemName);
  }

  @action
  addTempItemC() {
    this.send('addTempItem');
  }

  @action
  removeLineItemC(lineItem) {
    this.send('removeLineItem', lineItem);
  }

  @action
  saveAndPrintC() {
    this.send('saveAndPrint');
  }

  @action
  newSaleC() {
    this.send('newSale');
  }
}
