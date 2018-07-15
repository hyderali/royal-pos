import Component from '@ember/component';
export default Component.extend({
  tagName: 'tr',
  addNewItem: 'addNewItem',
  saveAndPrint: 'saveAndPrint',
  actions: {
    itemChanged(itemName) {
      if (itemName === 'print') {
        this.sendAction('saveAndPrint');
      }
      this.sendAction('addNewItem', itemName);
      this.set('id', '');
    }
  }
});
