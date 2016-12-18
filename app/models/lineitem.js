import Ember from 'ember';
const { computed } = Ember;
export default Ember.Object.extend({
  total: computed('quantity', 'rate', function() {
    let quantity = Number(this.get('quantity'));
    let rate = Number(this.get('rate'));
    return rate * quantity;
  })
});
