'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const os = require('os');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    }
  });

  app.import('node_modules/bootstrap/dist/css/bootstrap.min.css');
  app.import('node_modules/bootstrap/dist/js/bootstrap.min.js');
  app.import('node_modules/jsbarcode/dist/JsBarcode.all.min.js');

  let ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(`Serving on http://${iface.address}:4200`);
      } else {
        // this interface has only one ipv4 adress
        console.log(`Serving on http://${iface.address}:4200`);
      }
      ++alias;
    });
  });

  return app.toTree();
};