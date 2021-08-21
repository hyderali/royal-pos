import Controller from '@ember/controller';
import { computed } from '@ember/object';
export default Controller.extend({
  total: computed('model.[]', function(){
    let items = this.model;
    let total = 0;
    items.forEach((item) => {
      total += Number(item['Incoming Stock']);
    });
    return total;
  })
});
