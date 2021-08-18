import Controller from '@ember/controller';
import { computed } from '@ember/object';
export default Controller.extend({
  total: computed('items.@each.InitialStock', {
    get() {
      let items = this.items;
      let total = 0;
      items.forEach((item) => {
        total += item['Initial Stock'];
      });
      return total;
    },
    set(key, value) {
      return value;
    }
  }),
});
