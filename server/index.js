/*jshint node:true*/
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var Converter = require("csvtojson").Converter;
var converter = new Converter({
  checkType: false
});
var RSVP = require('rsvp');

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
module.exports = function(app) {
  app.use(bodyParser.text());
  fs.readFile('./server/royal.json', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var parsedData = JSON.parse(data);
    app.parsedData = parsedData;
  });
  converter.fromFile("./server/item.csv", function(err, result) {
    app.itemslist = result;
  });
  app.all('/api/itemslist', function(req, res) {
    res.json({
      items: app.itemslist,
      organization_id: app.parsedData.organization_id,
      customer_id: app.parsedData.customer_id
    });
  });
  app.all('/api/login', function(req, res) {
    var users = app.parsedData.users;
    var body = JSON.parse(req.body);
    var user;
    for (var i = 0, l = users.length; i < l; i++) {
      var usr = users[i];
      if (body.username === usr.username && body.password === usr.password) {
        user = usr;
        break;
      }
    }
    if (user) {
      res.json({
        message: 'success',
        user: user,
        organization_id: app.parsedData.organization_id,
        customer_id: app.parsedData.customer_id
      });
      return;
    }
    res.json({
      message: 'invalid credentials'
    });
  });
  app.all('/api/invoices', function(req, res) {
    var body = JSON.parse(req.body);
    var url = 'https://books.zoho.com/api/v3/invoices?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.post({
      url: url,
      form: {
        JSONString: req.body
      }
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json({
          message: 'success',
          invoice_id: parsedResponse.invoice.invoice_id
        });
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    });
  });
  app.all('/api/invoiceslist', function(req, res) {
    //var url = 'https://books.zoho.com/api/v3/invoices?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id+ '&customer_id='+app.parsedData.customer_id;
    var url = 'https://books.zoho.com/api/v3/invoices?authtoken=96f06677eaad4b848d6509e4acd981ed&status=draft&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
    request.get({
      url: url
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json(parsedResponse);
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    })
  });
  app.all('/api/payments', function(req, res) {
    var body = JSON.parse(req.body);
    var url = 'https://books.zoho.com/api/v3/customerpayments?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.post({
      url: url,
      form: {
        JSONString: req.body
      }
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json({
          message: 'success',
          payment_id: parsedResponse.payment.payment_id
        });
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    });
  });
  app.all('/api/newitem', function(req, res) {
    var body = JSON.parse(req.body);
    var url = 'https://books.zoho.com/api/v3/items?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.post({
      url: url,
      form: {
        JSONString: req.body
      }
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json({
          message: 'success',
          item: parsedResponse.item
        });
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    });
  });
  app.all('/api/newbill', function(req, res) {
    var body = JSON.parse(req.body);
    var url = 'https://books.zoho.com/api/v3/bills?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.post({
      url: url,
      form: {
        JSONString: req.body
      }
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json({
          message: 'success',
          bill: parsedResponse.bill
        });
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    });
  });
  app.all('/api/vendors', function(req, res) {
    var url = 'https://books.zoho.com/api/v3/contacts?filter_by=Status.ActiveVendors&authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.get({
      url: url
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json({
          message: 'success',
          contacts: parsedResponse.contacts
        });
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    });
  });
  app.all('/api/itemcustomfields', function(req, res) {
    var url = 'https://books.zoho.com/api/v3/settings/preferences/customfields?entity=item&is_entity_edit=true&authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.get({
      url: url
    }, function(err, httpResponse, response) {
      var parsedResponse = JSON.parse(response);
      if (parsedResponse.code === 0) {
        res.json({
          message: 'success',
          custom_fields: parsedResponse.customfields
        });
        return;
      }
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    });
  });
  app.all('/api/itemsupdate', function(req, res) {
    var body = JSON.parse(req.body);
    var items = body.items || [];
    var url = 'https://books.zoho.com/api/v3/items'
    var appendParams = '?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    var promises = items.map(function(item) {
      var apiurl = `${url}/${item['Item ID']}${appendParams}`;
      return new RSVP.Promise((resolve, reject) => {

        request.put({
          url: apiurl,
          form: {
            JSONString: JSON.stringify({
              rate: item.printRate
            })
          }
        }, function(err, httpResponse, response) {
          var parsedResponse = JSON.parse(response);
          var result;
          if (parsedResponse.code === 0) {
            result = {
              message: 'success'
            };
          } else {
            result = {
              message: 'failure',
              error: {
                message: parsedResponse.message,
                sku: item.SKU
              }
            };
          }
          resolve(result)
        });
      });
    });
    RSVP.all(promises).then(function(results) {
      var failedItems = results.filter(function(failedItem) {
        return failedItem.message === 'failure';
      });
      if (failedItems) {
        res.json({
          message: 'failure',
          failed_items: failedItems
        });
        return;
      }
      res.json({
        message: 'success'
      })
    }).catch(function(reason) {
      res.json({
        message: reason.message
      })
    });
  });

};
