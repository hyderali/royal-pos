import { inject as service } from '@ember/service';
import Component from '@ember/component';
import getItemName from '../utils/get-item-name';
export default Component.extend({
  session: service(),
  isSales: true,
  model: null,
  addNewItem: 'addNewItem',
  removeLineItem: 'removeLineItem',
  saveAndPrint: 'saveAndPrint',
  newSale: 'newSale',
  didInsertElement() {
    this._super();
    this.$('.ember-basic-dropdown-trigger').focus();
  },
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
    },
    selectSP(salesperson) {
      this.set('model.salesperson', salesperson);
    }
  }
});
