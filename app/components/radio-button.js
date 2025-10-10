import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'input',
  type: 'radio',

  attributeBindings: ['name', 'type', 'value', 'checked:checked', 'disabled'],

  change() {
    var value = this.value;

    this['on-change'](value);
  },
  checked: computed('selection', function () {
    let value = this.value;
    let selection = this.selection;

    if (typeof selection === 'object' || selection === undefined) {
      return value === selection;
    }
    return value === selection + '';
  })
});
