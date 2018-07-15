import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
  classNames: ['item-sticker'],
  classNameBindings: ['isFirstRow:first-row', 'isLastRow:last-row'],
  isFirstRow: computed('index', function() {
    let isFirstRow = (this.index / 3) < 1;
    return isFirstRow;
  }),
  isLastRow: computed('index', function() {
    let length = this.length;
    let index = this.index + 1;
    let maxlen = (parseInt(length / 3) + 1) * 3;
    let isLastRow = maxlen - index < 3;
    return isLastRow;
  })
});
