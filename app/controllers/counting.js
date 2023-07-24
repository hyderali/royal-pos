import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
    totalQty: computed('model.count.counts@each.qty', function() {
        let lineItems = this.model.count.counts;
        let total = lineItems.reduce((sum, item)=> {
          return sum + Number(item.qty);
        }, 0);
        return total;
    }),
    totalCV: computed('model.count.counts@each.cost_value', function() {
        let lineItems = this.model.count.counts;
        let total = lineItems.reduce((sum, item)=> {
          return sum + Number(item.cost_value);
        }, 0);
        return total;
    }),
    totalSV: computed('model.count.counts@each.sales_value', function() {
        let lineItems = this.model.count.counts;
        let total = lineItems.reduce((sum, item)=> {
          return sum + Number(item.sales_value);
        }, 0);
        return total;
    }),
});
