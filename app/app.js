import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'royal-pos/config/environment';
import { next } from '@ember/runloop';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  ready() {
    next(this, function() {
      document.getElementById('preLoader')?.remove();
    });
  }
}

loadInitializers(App, config.modulePrefix);