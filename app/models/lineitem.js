import Ember from 'ember';
const { computed, Object } = Ember;
export default Object.extend({
  total: computed('quantity', 'rate', function() {
    let quantity = Number(this.get('quantity'));
    let rate = Number(this.get('rate'));
    return rate * quantity;
  })
});
