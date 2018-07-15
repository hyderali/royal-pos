import Ember from 'ember';
import { next } from '@ember/runloop';
import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
const {
  TextSupport
} = Ember;
TextSupport.reopen({
  didInsertElement: function() {
    this._super(...arguments);
    if (this.autofocus) {
      next(this, function() {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }
        this.$().focus();
      });
    }
  }
});
const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  ready() {
    /* eslint ember/no-global-jquery: 'off' */
    // Remove loading splash screen
    $('#preLoader').remove();
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
