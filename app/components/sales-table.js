import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import getItemName from '../utils/get-item-name';
import { set, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SalesTable extends Component {
  constructor() {
    super(...arguments);
    this.customItems = [
      'Others',
      'China Item',
      'Cotton Pant',
      'Shirt',
      'Boys Pant',
      'Mens Inner',
      'Ladies Inner',
    ];
    this.discounts = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    this.isSales = this.args.isSales === undefined ? true : false;
  }

  @service
  session;

  @tracked
  id = '';

  @action
  itemChanged(itemName) {
    if (itemName === 'print') {
      this.args.saveAndPrint(false);
    }
    if (itemName === 'save') {
      this.args.saveAndPrint(true);
    }
    if (itemName === '0000') {
      this.args.addTempItem();
    }
    this.args.addNewItem(getItemName(itemName));
    this.id = '';
  }

  @action
  discountChanged(lineItem, discount) {
    set(lineItem, 'discount', discount);
  }

  @action
  selectCustomItem(lineItem, name) {
    set(lineItem, 'description', name);
  }

  @action
  removeLineItem(lineItem) {
    this.args.removeLineItem(lineItem);
  }

  @action
  saveAndPrint(skipPrint) {
    this.args.saveAndPrint(skipPrint);
  }

  @action
  newSale() {
    this.args.newSale();
  }

  @action
  selectSP(salesperson) {
    set(this.args, 'model.salesperson', salesperson);
  }
}
