import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'royal-pos/config/environment';
const { isTestEnvironment } = config;
export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  ready(): void {
    // Remove loading splash screen
    if(!isTestEnvironment) {
      const preLoader = document.querySelector('#preLoader');
      if (preLoader) {
        preLoader.remove();
      }
    }
  }
}

loadInitializers(App, config.modulePrefix);