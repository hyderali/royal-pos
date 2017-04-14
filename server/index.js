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
        entity_number: parsedResponse.invoice.invoice_number
      });
      return;
    }
    res.json({
      message: 'failure',
      error: parsedResponse.message
    });
  });
});
app.all('/api/updateinvoice', function(req, res) {
  var body = JSON.parse(req.body);
  var url = 'https://books.zoho.com/api/v3/invoices/'+req.query.invoice_id+'?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
  request.put({
    url: url,
    form: {
      JSONString: req.body
    }
  }, function(err, httpResponse, response) {
    var parsedResponse = JSON.parse(response);
    if (parsedResponse.code === 0) {
      res.json({
        message: 'success',
        entity_number: parsedResponse.invoice.invoice_number
      });
      return;
    }
    res.json({
      message: 'failure',
      error: parsedResponse.message
    });
  });
});
app.all('/api/creditnotes', function(req, res) {
  var body = JSON.parse(req.body);
  var url = 'https://books.zoho.com/api/v3/creditnotes?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
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
        entity_number: parsedResponse.creditnote.creditnote_number
      });
      return;
    }
    res.json({
      message: 'failure',
      error: parsedResponse.message
    });
  });
});
app.all('/api/invoicepdf', function(req, res) {
  var invoiceId = req.query.invoice_id;
  var url = 'https://books.zoho.com/api/v3/invoices/' + invoiceId + '?print=true&accept=pdf&authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
  var fileName = "pdf/invoice-"+invoiceId+".pdf";
  var file = fs.createWriteStream(fileName);
  request
  .get(url)
  .on('response', function(response) {
    response.pipe(file).on('close', function (code) {
      res.sendFile(fileName, { root: __dirname+'/../' });
    });
  });
});
app.all('/api/invoiceslist', function(req, res) {
  var url = 'https://books.zoho.com/api/v3/invoices?authtoken=' + req.query.authtoken + '&status=unpaid&page=1&per_page=200&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
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
app.all('/api/salespersons', function(req, res) {
  var url = 'https://books.zoho.com/api/v3/invoices/editpage?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
  request.get({
    url: url
  }, function(err, httpResponse, response) {
    var parsedResponse = JSON.parse(response);
    if (parsedResponse.code === 0) {
      res.json({salespersons: parsedResponse.salespersons});
      return;
    }
    res.json({
      message: 'failure',
      error: parsedResponse.message
    });
  })
});
app.all('/api/creditnoteslist', function(req, res) {
  var url = 'https://books.zoho.com/api/v3/creditnotes?authtoken=' + req.query.authtoken + '&status=open&page=1&per_page=200&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id + '&formatneeded=true';
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
app.all('/api/applycredits', function(req, res) {
  var body = JSON.parse(req.body);
  var url = 'https://books.zoho.com/api/v3/creditnotes/'+req.query.creditnote_id+'/invoices?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
  request.post({
    url: url,
    form: {
      JSONString: req.body
    }
  }, function(err, httpResponse, response) {
    var parsedResponse = JSON.parse(response);
    if (parsedResponse.code === 0) {
      res.json({
        message: 'success'
      });
      return;
    }
    res.json({
      message: 'failure',
      error: parsedResponse.message
    });
  });
});
app.all('/api/searchinvoice', function(req, res) {
  var url = 'https://books.zoho.com/api/v3/invoices?status=unpaid&invoice_number_contains='+req.query.invoice_number+'&authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
  request.get({
    url: url
  }, function(err, httpResponse, response) {
    var parsedResponse = JSON.parse(response);
    if (parsedResponse.code === 0 && parsedResponse.invoices && parsedResponse.invoices.length) {
      var url = 'https://books.zoho.com/api/v3/invoices/'+parsedResponse.invoices[0].invoice_id+'?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
      request.get({
        url: url
      }, function(err, httpResponse, response) {
        var secondResponse = JSON.parse(response);
        if (secondResponse.code === 0) {
          res.json(secondResponse);
          return;
        }
        res.json({
          message: 'failure',
          error: secondResponse.message
        });
      });
    } else {
      res.json({
        message: 'failure',
        error: parsedResponse.message
      });
    }
  });
});
app.all('/api/paymentpdf', function(req, res) {
  var payment_id = req.query.payment_id;
  var url = 'https://books.zoho.com/api/v3/customerpayments/' + payment_id + '?print=true&accept=pdf&authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
  var fileName = "pdf/payment-"+payment_id+".pdf";
  var file = fs.createWriteStream(fileName);
  request
  .get(url)
  .on('response', function(response) {
    response.pipe(file).on('close', function (code) {
      res.sendFile(fileName, { root: __dirname+'/../' });
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
