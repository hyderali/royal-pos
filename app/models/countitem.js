import Object, { computed } from '@ember/object';
export default Object.extend({
    cost_value: computed('qty', 'cost_price', function() {
        return Number(this.qty)*Number(this.cost_price)
    }),
    sales_value: computed('qty', 'sales_price', function() {
        return Number(this.qty)*Number(this.sales_price)
    })
});