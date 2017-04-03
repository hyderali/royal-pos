import Ember from 'ember';
import config from './config/environment';
const { Router: emRouter } = Ember;
const Router = emRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('sales');
  this.route('payment', function() {
    this.route('new');
  });
  this.route('adjustitem');
  this.route('barcode');
  this.route('purchase');
  this.route('printsticker');
  this.route('returns');
  this.route('editsales');
});

export default Router;
