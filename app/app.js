import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'royal-pos/config/environment';
export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
  ready() {
    // Remove loading splash screen
    document.querySelector('#preLoader').remove();
  }
}

loadInitializers(App, config.modulePrefix);
