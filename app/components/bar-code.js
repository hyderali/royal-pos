import Component from '@glimmer/component';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class BarCodeComponent extends Component {
  @action
  setupBarcode(element) {
    const { sku, displayValue = true } = this.args;
    
    schedule('afterRender', () => {
      window.JsBarcode(element, sku, {
        width: 1.5,
        height: 22.5,
        fontSize: 13,
        margin: 0,
        displayValue
      });
    });
  }
}