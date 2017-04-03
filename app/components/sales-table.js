import Ember from 'ember';
const { Component } = Ember;
import getItemName from '../utils/get-item-name';
export default Component.extend({
  model: null,
  addNewItem: 'addNewItem',
  removeLineItem: 'removeLineItem',
  saveAndPrint: 'saveAndPrint',
  newSale: 'newSale',
  actions: {
    itemChanged(itemName) {
      if (itemName === 'print') {
        this.sendAction('saveAndPrint');
      }
      this.sendAction('addNewItem', getItemName(itemName));
      this.set('id', '');
    },
    removeLineItem(lineItem) {
      this.sendAction('removeLineItem', lineItem);
    },
    saveAndPrint() {
      this.sendAction('saveAndPrint');
    },
    newSale() {
      this.sendAction('newSale');
    }
  }
});
