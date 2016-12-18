/*jshint node:true*/
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var Converter = require("csvtojson").Converter;
var converter = new Converter({
  checkType: false
});

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
    console.log(req.query.authtoken);
    var url = 'https://books.zoho.com/api/v3/invoices?authtoken=' + req.query.authtoken + '&organization_id=' + app.parsedData.organization_id;
    request.post({
      url: url,
      form: {
        JSONString: req.body
      }
    }, function(err, httpResponse, response) {
      let parsedResponse = JSON.parse(response);
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
};
