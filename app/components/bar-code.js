/* eslint new-cap: "off" */
import Component from '@ember/component';

import { schedule } from '@ember/runloop';
export default Component.extend({
  tagName: 'svg',
  sku: '',
  classNames: ['text-center'],
  displayValue: true,
  didInsertElement() {
    let sku = this.sku;
    let displayValue = this.displayValue;
    this._super();
    schedule('afterRender', this, () => {
      this.$().JsBarcode(sku, {
        width: 1.5,
        height: 22.5,
        fontSize: 13,
        margin: 0,
        displayValue
      });
    });
  }
});
