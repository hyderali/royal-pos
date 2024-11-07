import Component from '@glimmer/component';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class BarCode extends Component {
  sku = '';
  displayValue = true;

  @action
  addBarCode(element) {
    let sku = this.args.sku;
    let displayValue =
      this.args.displayValue === undefined ? true : this.args.displayValue;
    schedule('afterRender', this, () => {
      JsBarcode(element, sku, {
        width: 1.5,
        height: 22.5,
        fontSize: 13,
        margin: 0,
        displayValue,
      });
    });
  }
}
