import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LineItemComponent extends Component {
  @action
  itemChanged(itemName) {
    if (itemName === 'print') {
      this.args.saveAndPrint();
      return;
    }
    this.args.addNewItem(itemName);
    this.args.id = '';
  }
}