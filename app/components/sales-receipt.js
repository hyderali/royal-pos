import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class SalesReceipt extends Component {
  @service
  session;

  constructor() {
    super(...arguments);
    this.numberLabel = this.args.numberLabel || 'Bill No';
    this.isSales = this.args.isSales === undefined ? true : false;
  }
}
