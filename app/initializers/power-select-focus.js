import { next } from '@ember/runloop';
import EmberPowerSelect from 'ember-power-select/components/power-select';
export function initialize(/* application */) {
    EmberPowerSelect.reopen({
        didInsertElement: function() {
            this._super(...arguments);
            next(() => {
                if(this.get('autofocus')) {
                  this._super(...arguments);
                  document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`).focus();
                }
            });
        }
    });
}
export default {
  initialize
};
