/* eslint-disable */
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

  function makeRequest(url, options) {
    url = `https://books.zoho.com/api/v3${url}&organization_id=${app.parsedData.organization_id}`;
    var method = options.method;
    if (method === 'GET') {
      return new RSVP.Promise((resolve, reject) => {
        request.get({
          url: url
        }, function(err, httpResponse, response) {
          try {
            var parsedResponse = JSON.parse(response);
            if (parsedResponse.code === 0) {
              resolve(parsedResponse);
            } else {
              reject(parsedResponse.message);
            }
          } catch (e) {

            console.log(`URL is ${url}`);
            reject('Error in connection. Try again');
          }
        })
      });
    }
    if (method === 'POST') {
      return new RSVP.Promise((resolve, reject) => {
        request.post({
          url: url,
          form: {
            JSONString: options.body
          }
        }, function(err, httpResponse, response) {
          try {
            var parsedResponse = JSON.parse(response);
            if (parsedResponse.code === 0) {
              resolve(parsedResponse);
            } else {
              reject(parsedResponse.message);
            }
          } catch (e) {
            reject('Error in connection. Try again');
          }
        })
      });
    }
    if (method === 'PUT') {
      return new RSVP.Promise((resolve, reject) => {
        request.put({
          url: url,
          form: {
            JSONString: options.body
          }
        }, function(err, httpResponse, response) {
          try {
            var parsedResponse = JSON.parse(response);
            if (parsedResponse.code === 0) {
              resolve(parsedResponse);
            } else {
              reject(parsedResponse.message);
            }
          } catch (e) {
            reject('Error in connection. Try again');
          }
        })
      });
    }
  };
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
        customer_id: app.parsedData.customer_id,
        inventory_account_id: app.parsedData.inventory_account_id,
        cogs_id: app.parsedData.cogs_id
      });
      return;
    }
    res.json({
      message: 'invalid credentials'
    });
  });
  app.all('/api/salespersons', function(req, res) {
    var url = `/invoices/editpage?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'GET'
    }).then(function(json) {
      res.json({
        message: 'success',
        salespersons: json.salespersons
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/invoices', function(req, res) {
    var url = `/invoices?authtoken=${req.query.authtoken}&is_quick_create=true`;
    makeRequest(url, {
      method: 'POST',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success',
        entity_number: json.invoice.invoice_number
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/updateinvoice', function(req, res) {
    var url = `/invoices/${req.query.invoice_id}?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'PUT',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success',
        entity_number: json.invoice.invoice_number
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/creditnotes', function(req, res) {
    var url = `/creditnotes?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'POST',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success',
        entity_number: json.creditnote.creditnote_number
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/invoiceslist', function(req, res) {
    var url = `/invoices?authtoken=${req.query.authtoken}&status=unpaid&page=1&per_page=200&customer_id=${app.parsedData.customer_id}`;
    makeRequest(url, {
      method: 'GET'
    }).then(function(json) {
      res.json(json);
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/creditnoteslist', function(req, res) {
    //var url = `/creditnotes?authtoken=${req.query.authtoken}&status=open&page=1&per_page=200&customer_id=${app.parsedData.customer_id}&formatneeded=true`;
    var url = `/creditnotes?authtoken=${req.query.authtoken}&filter_by=Status.Open&page=1&per_page=200&formatneeded=true`;
    makeRequest(url, {
      method: 'GET'
    }).then(function(json) {
      res.json(json);
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/payments', function(req, res) {
    var url = `/customerpayments?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'POST',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success',
        payment_id: json.payment.payment_id
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/applycredits', function(req, res) {
    var url = `/creditnotes/${req.query.creditnote_id}/invoices?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'POST',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success'
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/searchinvoice', function(req, res) {
    var url = `/invoices?status=unpaid&invoice_number_contains=${req.query.invoice_number}&authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'GET'
    }).then(function(json) {
      var url = '/invoices/' + json.invoices[0].invoice_id + '?authtoken=' + req.query.authtoken;
      makeRequest(url, {
        method: 'GET'
      }).then(function(secondJson) {
        res.json(secondJson);
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/vendors', function(req, res) {
    var url = `/contacts?filter_by=Status.ActiveVendors&authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'GET'
    }).then(function(json) {
      res.json({
        message: 'success',
        contacts: json.contacts
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/itemcustomfields', function(req, res) {
    var url = `/settings/preferences/customfields?entity=item&is_entity_edit=true&authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'GET'
    }).then(function(json) {
      res.json({
        message: 'success',
        custom_fields: json.customfields
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/newitem', function(req, res) {
    var url = `/items?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'POST',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success',
        item: json.item
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/newbill', function(req, res) {
    var url = `/bills?authtoken=${req.query.authtoken}`;
    makeRequest(url, {
      method: 'POST',
      body: req.body
    }).then(function(json) {
      res.json({
        message: 'success',
        bill: json.bill
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/itemsupdate', function(req, res) {
    var body = JSON.parse(req.body);
    var items = body.items || [];
    var appendParams = `?authtoken=${req.query.authtoken}`;
    var promises = items.map(function(item) {
      var apiurl = `/items/${item['Item ID']}${appendParams}`;
      return new RSVP.Promise((resolve, reject) => {
        makeRequest(apiurl, {
          method: 'PUT',
          body: JSON.stringify({
            rate: item.printRate
          })
        }).then(function(json) {
          resolve({
            message: 'success'
          });
        }).catch(function(message) {
          resolve({
            message: 'failure',
            error: {
              message: message,
              sku: item.SKU
            }
          });
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
  // app.all('/api/invoicepdf', function(req, res) {
  //   var invoiceId = req.query.invoice_id;
  //   var url = 'https://books.zoho.com/api/v3/invoices/' + invoiceId + '?print=true&accept=pdf&authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
  //   var fileName = "pdf/invoice-" + invoiceId + ".pdf";
  //   var file = fs.createWriteStream(fileName);
  //   request
  //     .get(url)
  //     .on('response', function(response) {
  //       response.pipe(file).on('close', function(code) {
  //         res.sendFile(fileName, {
  //           root: __dirname + '/../'
  //         });
  //       });
  //     });
  // });
};
