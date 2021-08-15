import Component from '@ember/component';
import { inject as service } from '@ember/service';
export default Component.extend({
  session: service(),
  numberLabel: 'Bill No',
  isSales: true
});
