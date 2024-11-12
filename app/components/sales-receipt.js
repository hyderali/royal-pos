import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SalesReceiptComponent extends Component {
  @service session;

  get numberLabel() {
    return this.args.numberLabel || 'Bill No';
  }

  get isSales() {
    return this.args.isSales ?? true;
  }
}