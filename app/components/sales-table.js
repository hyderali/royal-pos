import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isBlank } from '@ember/utils';
import getItemName from '../utils/get-item-name';
import { set } from '@ember/object';
export default Component.extend({
  session: service(),
  isSales: true,
  model: null,
  addNewItem: 'addNewItem',
  addTempItem: 'addTempItem',
  removeLineItem: 'removeLineItem',
  saveAndPrint: 'saveAndPrint',
  newSale: 'newSale',
  customItems: [
    'Others',
    'China Item',
    'Cotton Pant',
    'Shirt',
    'Boys Pant',
    'Mens Inner',
    'Ladies Inner'
  ],
  focusComesFromOutside(e) {
    let blurredEl = e.relatedTarget;
    if (isBlank(blurredEl)) {
      return false;
    }
    return !blurredEl.classList.contains('ember-power-select-search-input');
  },
  actions: {
    itemChanged(itemName) {
      if (itemName === 'print') {
        this.sendAction('saveAndPrint', false);
      }
      if (itemName === 'save') {
        this.sendAction('saveAndPrint', true);
      }
      if (itemName === '0000') {
        this.sendAction('addTempItem');
      }
      this.sendAction('addNewItem', getItemName(itemName));
      this.set('id', '');
    },
    handleEPSFocus(select, e) {
      if (this.focusComesFromOutside(e)) {
        select.actions.open();
      }
    },
    selectCustomItem(lineItem, name) {
      set(lineItem, 'description', name);
    },
    selectTag(lineItem, name) {
      set(lineItem, 'tag', name);
    },
    removeLineItem(lineItem) {
      this.sendAction('removeLineItem', lineItem);
    },
    saveAndPrint(skipPrint) {
      this.sendAction('saveAndPrint', skipPrint);
    },
    newSale() {
      this.sendAction('newSale');
    },
    selectSP(salesperson) {
      this.set('model.salesperson', salesperson);
    }
  }
});
