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
        width: 0.75,
        height: 15,
        fontSize: 8,
        margin: 0
      });
    });
  }
});
