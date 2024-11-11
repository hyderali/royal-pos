import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import getItemName from '../utils/get-item-name';

export default class SalesTableComponent extends Component {
  @service session;
  @tracked id = '';

  customItems = [
    'Others',
    'China Item',
    'Cotton Pant',
    'Shirt',
    'Boys Pant',
    'Mens Inner',
    'Ladies Inner'
  ];

  discounts = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  focusComesFromOutside(e) {
    const blurredEl = e.relatedTarget;
    return !blurredEl?.classList.contains('ember-power-select-search-input');
  }

  @action
  itemChanged(itemName) {
    if (itemName === 'print') {
      this.args.saveAndPrint(false);
      return;
    }
    if (itemName === 'save') {
      this.args.saveAndPrint(true);
      return;
    }
    if (itemName === '0000') {
      this.args.addTempItem();
      return;
    }
    this.args.addNewItem(getItemName(itemName));
    this.id = '';
  }

  @action
  discountChanged(lineItem, discount) {
    lineItem.discount = discount;
  }

  @action
  handleEPSFocus(select, e) {
    if (this.focusComesFromOutside(e)) {
      select.actions.open();
    }
  }

  @action
  selectCustomItem(lineItem, name) {
    lineItem.description = name;
  }

  @action
  selectSP(salesperson) {
    this.args.model.salesperson = salesperson;
  }
}