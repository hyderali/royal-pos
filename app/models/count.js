import Object, { computed } from '@ember/object';
export default Object.extend({
    totalQty: computed('items.@each.qty', function() {
        let lineItems = this.items;
        let total = lineItems.reduce((sum, item)=> {
          return sum + Number(item.get('qty'));
        }, 0);
        return total;
    }),
    totalCV: computed('items.@each.cost_value', function() {
        let lineItems = this.items;
        let total = lineItems.reduce((sum, item)=> {
          return sum + Number(item.get('cost_value'));
        }, 0);
        return total;
    }),
    totalSV: computed('items.@each.sales_value', function() {
        let lineItems = this.items;
        let total = lineItems.reduce((sum, item)=> {
          return sum + Number(item.get('sales_value'));
        }, 0);
        return total;
    }),
});