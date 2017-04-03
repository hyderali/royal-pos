import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
const { TextSupport, run: { next }, Application } = Ember;
let App;
TextSupport.reopen({
  becomeFocused: function() {
    if (this.get('autofocus')) {
      next(this, function() {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }
        this.$().focus();
      });
    }
  }.on('didInsertElement')
});
Ember.MODEL_FACTORY_INJECTIONS = true;

App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  ready() {
    // Remove loading splash screen
    $('#preLoader').remove();
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
