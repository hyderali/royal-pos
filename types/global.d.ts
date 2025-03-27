declare module 'royal-pos/config/environment' {
  const config: {
    modulePrefix: string;
    podModulePrefix: string;
    environment: string;
    rootURL: string;
    locationType: string;
    EmberENV: {
      EXTEND_PROTOTYPES: boolean;
      FEATURES: Record<string, unknown>;
    };
    APP: Record<string, unknown>;
  };
  export default config;
}

declare module '@ember-decorators/object' {
  export function observes(...dependencies: string[]): MethodDecorator;
}

declare module 'ember-power-select/components/power-select' {
  export default class PowerSelect extends Ember.Component {}
}
