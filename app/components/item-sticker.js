import Ember from 'ember';
const {computed} = Ember;
export default Ember.Component.extend({
  classNames: ['item-sticker'],
  classNameBindings: ['isFirstRow:first-row', 'isLastRow:last-row'],
  isFirstRow: computed('index', function() {
    let isFirstRow = (this.get('index')/3) < 1;
    return isFirstRow;
  }),
  isLastRow: computed('index', function() {
    let length = this.get('length');
    let index = this.get('index')+1;
    let maxlen = (parseInt(length/3)+1)*3;
    let isLastRow = maxlen - index < 3;
    return isLastRow;
  })
});
