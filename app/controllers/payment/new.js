import Ember from 'ember';
const { computed, get } = Ember;
export default Ember.Controller.extend({
  queryParams: ['invoiceids'],
  total: computed('model.@each.balance', function() {
    let model = this.get('model');
    let total = model.reduce((sum, item)=> {
      return sum + Number(item.balance);
    }, 0);
    return total;
  }),
  discount: computed('model.@each.discount', function() {
    let model = this.get('model');
    let total = model.reduce((sum, item)=> {
      return sum + Number(item.discount || 0);
    }, 0);
    return total;
  }),
  balance: computed('total', 'received', 'discount', function() {
    let total = this.get('total');
    let received = Number(this.get('received')||0);
    let discount = Number(this.get('discount')||0);
    return (received + discount - total).toFixed(2);
  })
});
