/* eslint-disable */
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var csv = require("csvtojson");
var json2CSVConverter = require('json-2-csv');
var RSVP = require('rsvp');
var oauth = require('./oauth');
// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
module.exports = async function(app) {
  console.log('inside app');
  
  app.use(bodyParser.text());
  fs.readFile('./server/royal.json', 'utf8', async function(err, data) {
    if (err) {
      return console.log(err);
    }
    var parsedData = JSON.parse(data);
    for (var i = 0, l = parsedData.users.length; i < l; i++) {
      var usr = parsedData.users[i];
      if(usr.refresh_token) {
        await oauth.generateAccessToken(usr, true);
      }
    }
    app.parsedData = parsedData;
  });

  fs.readFile('./items/names.json', 'utf8', function(err, names) {
    if (err) {
      return console.log(err);
    }
    var parsedNames = JSON.parse(names);
    app.names = parsedNames.names;
  });
  fs.readFile('./items/brands.json', 'utf8', function(err, brands) {
    if (err) {
      return console.log(err);
    }
    var parsedBrands = JSON.parse(brands);
    app.brands = parsedBrands.brands;
  });
  fs.readFile('./items/designs.json', 'utf8', function(err, designs) {
    if (err) {
      return console.log(err);
    }
    var parsedDesigns = JSON.parse(designs);
    app.designs = parsedDesigns.designs;
  });
  fs.readFile('./items/groups.json', 'utf8', function(err, groups) {
    if (err) {
      return console.log(err);
    }
    var parsedGroups = JSON.parse(groups);
    app.groups = parsedGroups.groups;
  });
  fs.readFile('./items/sizes.json', 'utf8', function(err, sizes) {
    if (err) {
      return console.log(err);
    }
    var parsedSizes = JSON.parse(sizes);
    app.sizes = parsedSizes.sizes;
  });
  csv({checkType: false})
.fromFile("./server/item.csv")
.then((result)=>{
    app.itemslist = result;
  });
  function getAccessToken(username) {
    var users = app.parsedData.users;
    var selectedUser;
    for (var i = 0, l = users.length; i < l; i++) {
      var usr = users[i];
      if(usr.username === username) {
        selectedUser = usr;
        break;
      }
    }
    return selectedUser.access_token;
  };
  function makeRequest(url, options) {
    var appendSymbol = '?';
    if(url.indexOf('?')!== -1) {
      appendSymbol = '&';
    }
    url = `https://www.zohoapis.com/books/v3${url}${appendSymbol}organization_id=${app.parsedData.organization_id}`;
    var method = options.method;
    var accessToken = getAccessToken(options.username);
    var headers = {
      Authorization: 'Zoho-oauthtoken '+accessToken
    };
    if (method === 'GET') {
      return new RSVP.Promise((resolve, reject) => {
        request.get({
          url,
          headers
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
          url,
          form: {
            JSONString: options.body
          },
          headers
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
          url,
          form: {
            JSONString: options.body
          },
          headers
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
      items: app.itemslist
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
        org_name: app.parsedData.org_name,
        org_address: app.parsedData.org_address,
        org_phone: app.parsedData.org_phone,
        customer_id: app.parsedData.customer_id,
        inventory_account_id: app.parsedData.inventory_account_id,
        cogs_id: app.parsedData.cogs_id,
        names: app.names,
        brands: app.brands,
        designs: app.designs,
        groups: app.groups,
        sizes: app.sizes
      });
      return;
    }
    res.json({
      message: 'invalid credentials'
    });
  });
  app.all('/api/salespersons', function(req, res) {
    var url = '/invoices/editpage';
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
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
    var url = '/invoices?is_quick_create=true';
    makeRequest(url, {
      method: 'POST',
      body: req.body,
      username: req.query.username
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
    var url = `/invoices/${req.query.invoice_id}`;
    makeRequest(url, {
      method: 'PUT',
      body: req.body,
      username: req.query.username
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
    var url = '/creditnotes';
    makeRequest(url, {
      method: 'POST',
      body: req.body,
      username: req.query.username
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
    var url = `/invoices?status=unpaid&page=1&per_page=200&customer_id=${app.parsedData.customer_id}`;
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
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
    //var url = `/creditnotes?status=open&page=1&per_page=200&customer_id=${app.parsedData.customer_id}&formatneeded=true`;
    var url = '/creditnotes?filter_by=Status.Open&page=1&per_page=200&formatneeded=true';
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
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
    var url = '/customerpayments';
    makeRequest(url, {
      method: 'POST',
      body: req.body,
      username: req.query.username
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
    var url = `/creditnotes/${req.query.creditnote_id}/invoices`;
    makeRequest(url, {
      method: 'POST',
      body: req.body,
      username: req.query.username
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
    var url = `/invoices?status=unpaid&invoice_number_contains=${req.query.invoice_number}`;
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
    }).then(function(json) {
      var url = '/invoices/' + json.invoices[0].invoice_id;
      makeRequest(url, {
        method: 'GET',
        username: req.query.username
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
    var url = '/contacts?filter_by=Status.ActiveVendors';
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
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
    var url = '/settings/preferences/customfields?entity=item&is_entity_edit=true';
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
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
  app.all('/api/items', function(req, res) {
    var cfParams = req.query.cf_params;
    var cfParamString = '';
    for (var key in cfParams) {
      if (cfParams.hasOwnProperty(key)) {
        cfParamString = `${cfParamString}${key}=${cfParams[key]}&`
      }
    }
    var url = `/items?${cfParamString}page=${req.query.page}`;
    makeRequest(url, {
      method: 'GET',
      username: req.query.username
    }).then(function(json) {
      res.json({
        message: 'success',
        items: json.items,
        has_more_page: json.page_context.has_more_page
      });
    }).catch(function(message) {
      res.json({
        message: 'failure',
        error: message
      });
    });
  });
  app.all('/api/newitem', function(req, res) {
    var url = '/items';
    makeRequest(url, {
      method: 'POST',
      body: req.body,
      username: req.query.username
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
    var url = '/bills';
    makeRequest(url, {
      method: 'POST',
      body: req.body,
      username: req.query.username
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
  app.all('/api/newattribute', function(req, res) {
    var body = JSON.parse(req.body);
    var attribute = body.attribute;
    var searchText = body.searchText;
    var files = {
      names: './items/names.json',
      groups: './items/groups.json',
      sizes: './items/sizes.json',
      designs: './items/designs.json',
      brands: './items/brands.json'
    };
    app[attribute].push(searchText);
    var fileName = files[attribute];
    groups = fs.readFileSync(fileName, 'utf8');
    var parsedData = JSON.parse(groups);
    parsedData[attribute].push(searchText);
    fs.writeFileSync(fileName, JSON.stringify(parsedData));
    res.json({
      message: 'attribute added successfully'
    })
  });
  app.all('/api/itemsupdate', function(req, res) {
    var body = JSON.parse(req.body);
    var items = body.items || [];
    var promises = items.map(function(item) {
      var apiurl = `/items/${item['Item ID']}`;
      return new RSVP.Promise((resolve, reject) => {
        makeRequest(apiurl, {
          method: 'PUT',
          body: JSON.stringify({
            rate: item.printRate
          }),
          username: req.query.username
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
  app.all('/api/adjustment', function(req, res) {
    var body = JSON.parse(req.body);
    var items = body.items;
    var date = body.date;
    var newItems,newItemsCSV, currentItem, adjustmentsCSV, itemsPromise, adjustmentsPromise;
    newItemsCSV = 'Item Name,SKU,Description,Rate,Product Type,Status,Purchase Rate,Purchase Account,Inventory Account,Initial Stock,Initial Stock Rate,Item Type,Design,Size,Brand,Colour,Group,Discount';
    if (fs.existsSync('./csvs/newitem.csv')) {
      newItemsCSV = fs.readFileSync('./csvs/newitem.csv', 'utf8');
    }
    adjustmentsCSV = 'Date,Reference Number,Reference Number Int,Reason,Quantity Adjusted,Item Name,SKU,Account';
    if (fs.existsSync('./csvs/itemadjustment.csv')) {
      adjustmentsCSV = fs.readFileSync('./csvs/itemadjustment.csv', 'utf8');
    }
    itemsPromise = json2CSVConverter.csv2jsonAsync(newItemsCSV).then((result)=> {
      return new RSVP.Promise((resolve, reject) => {
        newItems = result || [];
        items.forEach(item => {
          currentItem = newItems.find(citem => citem.SKU === item.SKU);
          if(currentItem) {
            currentItem['Initial Stock'] = Number(currentItem['Initial Stock']) + Number(item['Initial Stock']);
          } else {
            newItems.push(item);
          }
        });
        resolve(newItems);
      });
    }).then((newItems) => {
      json2CSVConverter.json2csvAsync(newItems).then((newItemsCSV) => {
        fs.writeFileSync('./csvs/newitem.csv', newItemsCSV);
      })
    });
    adjustmentsPromise = json2CSVConverter.csv2jsonAsync(adjustmentsCSV).then((adjustments)=> {
      return new RSVP.Promise((resolve, reject) => {
        var lastRefNumber = Number((adjustments[adjustments.length - 1] || {})['Reference Number Int'] || 0);
        items.forEach(item => {
          adjustments.push({
            'Date': date,
            'Reference Number': `${date}-${lastRefNumber + 1}`,
            'Reference Number Int': lastRefNumber + 1,
            'Reason': 'Moved to Royal',
            'Quantity Adjusted': -item['Initial Stock'],
            'Item Name': item['Item Name'],
            'SKU': item['SKU'],
            'Account': 'Royal Transfer'
          });
        });
        resolve(adjustments);
      });
    }).then((adjustments) => {
      json2CSVConverter.json2csvAsync(adjustments).then((adjustmentsCSV) => {
        fs.writeFileSync('./csvs/itemadjustment.csv', adjustmentsCSV);
      })
    });
    RSVP.hash({itemsPromise, adjustmentsPromise}).then(()=> {
      res.json({
        message: 'success',
      });
    }).catch((err)=> {
      res.json({
        message: 'failure',
        error: err.message
      });
    })
  });
  app.all('/api/getnewstock', function(req, res) {
    var items = app.itemslist;
    var newItems,newItemsCSV, currentItem, oldStock, incomingStock, newStock;
    try {
      newItemsCSV = fs.readFileSync('./csvs/newitem.csv', 'utf8');
    } catch {
      res.json({
        message: 'failure',
        error: 'New Item CSV file not found'
      });
      return;
    }
    json2CSVConverter.csv2jsonAsync(newItemsCSV).then((result)=> {
      return new RSVP.Promise((resolve, reject) => {
        newItems = result || [];
        resolve(newItems);
      });
    }).then((newItems) => {
      res.json({
        items: newItems,
        message: 'success',
      });
    }).catch((err)=> {
      res.json({
        message: 'failure',
        error: err.message
      });
    });
  });
  app.all('/api/updatestock', function(req, res) {
    var body = JSON.parse(req.body);
    var items = body.items;
    var printItems = body.printItems;
    var importItemsPromise = json2CSVConverter.json2csvAsync(items).then((newItemsCSV) => {
        new RSVP.Promise((resolve, reject) => {
          fs.writeFileSync('./csvs/importitem.csv', newItemsCSV);
          fs.unlinkSync('./csvs/newitem.csv');
          resolve(newItems);
        })
    });
    var printItemsPromise = json2CSVConverter.json2csvAsync(printItems).then((printItemsCSV) => {
      new RSVP.Promise((resolve, reject) => {
        fs.writeFileSync('./csvs/printitems.csv', printItemsCSV);
        resolve(newItems);
      })
    });
    RSVP.hash({importItemsPromise, printItemsPromise}).then((newItems)=> {
      res.json({
        newItems: newItems,
        message: 'success',
      });
    }).catch((err)=> {
      res.json({
        message: 'failure',
        error: err.message
      });
    });
  });
  app.all('/api/allcount', function(req, res) {
    fs.readFile('./count/allcount.json', 'utf8', function(err, allcount) {
      if (err) {
        return console.log(err);
      }
      var parsedCount = JSON.parse(allcount);
      res.json({
        count: parsedCount,
        message: 'success',
      });
    }); 
  });
  app.all('/api/newcount', function(req, res) {
    var body = JSON.parse(req.body);
    var count_id = body.count_id;
    var total = body.total;
    fs.writeFileSync('./count/'+count_id+'.json', JSON.stringify(body));
    allcount = fs.readFileSync('./count/allcount.json', 'utf8');
    var parsedData = JSON.parse(allcount);
    parsedData['counts'].push({
      count_id,
      qty: total.qty,
      cost_value: total.cost_value,
      sales_value: total.sales_value,
    });
    parsedData['next_count_id'] = parsedData['next_count_id'] + 1;
    fs.writeFileSync('./count/allcount.json', JSON.stringify(parsedData));
    res.json({
      message: 'count added successfully'
    })
  });
  app.all('/api/editcount', function(req, res) {
    fs.readFile('./count/'+req.query.count_id+'.json', 'utf8', function(err, allcount) {
      if (err) {
        return console.log(err);
      }
      var parsedCount = JSON.parse(allcount);
      res.json({
        count: parsedCount,
        message: 'success',
      });
    }); 
  });
  app.all('/api/updatecount', function(req, res) {
    var body = JSON.parse(req.body);
    var count_id = body.count_id;
    var total = body.total;
    allcount = fs.readFileSync('./count/allcount.json', 'utf8');
    var parsedData = JSON.parse(allcount);
    var oldCount = parsedData['counts'].find(count => count.count_id === count_id);
    if(oldCount) {
      oldCount.qty = total.qty;
      oldCount.cost_value = total.cost_value;
      oldCount.sales_value = total.sales_value;
      fs.writeFileSync('./count/allcount.json', JSON.stringify(parsedData));
      fs.writeFileSync('./count/'+count_id+'.json', JSON.stringify(body));
      res.json({
        message: 'count added successfully'
      })
    }
  });
  app.all('/api/deletecount', function(req, res) {
    var body = JSON.parse(req.body);
    var count_id = body.count_id;
    allcount = fs.readFileSync('./count/allcount.json', 'utf8');
    var parsedData = JSON.parse(allcount);
    var newCounts = parsedData['counts'].filter(count => count.count_id !== count_id);
    parsedData.counts = newCounts;
    fs.unlinkSync('./count/'+count_id+'.json');
    fs.writeFileSync('./count/allcount.json', JSON.stringify(parsedData));
      res.json({
        message: 'count added successfully'
      })
  });
  // app.all('/api/invoicepdf', function(req, res) {
  //   var invoiceId = req.query.invoice_id;
  //   var url = 'https://www.zohoapis.com/books/v3/invoices/' + invoiceId + '?print=true&accept=pdf&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
  //   var fileName = "pdf/invoice-" + invoiceId + ".pdf";
  //   var file = fs.createWriteStream(fileName);
  //   request
  //     .get({
        //   url,
        //   headers: {
        //     Authorization: 'Zoho-oauthtoken '+json.access_token
        //   }
        // })
  //     .on('response', function(response) {
  //       response.pipe(file).on('close', function(code) {
  //         res.sendFile(fileName, {
  //           root: __dirname + '/../'
  //         });
  //       });
  //     });
  // });
};
