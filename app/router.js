import EmberRouter from '@ember/routing/router';
import config from 'royal-pos/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('sales');
  this.route('payment', function () {
    this.route('new');
  });
  this.route('adjustitem');
  this.route('barcode');
  this.route('purchase');
  this.route('printsticker');
  this.route('returns');
  this.route('editsales');
  this.route('stockdetails');
  this.route('plainsticker');
  this.route('pantsticker');
  this.route('packsticker');
  this.route('addstock');
  this.route('updatestock');
  this.route('newcount');
  this.route('editcount', { path: 'editcount/:count_id' });
  this.route('counting');
});
