import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'svg',
  sku: '',
  classNames: ['text-center'],
  didInsertElement() {
    let sku = this.get('sku');
    this._super();
    Ember.run.schedule('afterRender', this, () => {
      this.$().JsBarcode(sku, {
        width: 1,
        height: 22.5,
        fontSize: 13,
        margin: 0
      });
    });
  }
});
