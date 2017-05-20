/* eslint new-cap: "off" */
import Ember from 'ember';
const { Component, run: { schedule } } = Ember;
export default Component.extend({
  tagName: 'svg',
  sku: '',
  classNames: ['text-center'],
  didInsertElement() {
    let sku = this.get('sku');
    this._super();
    schedule('afterRender', this, () => {
      this.$().JsBarcode(sku, {
        width: 1.5,
        height: 22.5,
        fontSize: 13,
        margin: 0
      });
    });
  }
});
