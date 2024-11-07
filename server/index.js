/* eslint-disable */
const bodyParser = require('body-parser');
const fs = require('fs');
const Converter = require("csvtojson").Converter;
const converter = new Converter({
  checkType: false
});
const json2CSVConverter = require('json-2-csv');
const RSVP = require('rsvp');
const chalk = require('chalk');
const fetch = require('node-fetch');
const oauth = require('./oauth');
const nocache = require('nocache');

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
module.exports = async function(app) {
  app.use(bodyParser.text());
  app.use(nocache());
  app.set('etag', false);
  fs.readFile('./server/royal.json', 'utf8', async function(err, data) {
    if (err) {
      return console.log(err);
    }
    const parsedData = JSON.parse(data);
    for (let i = 0, l = parsedData.users.length; i < l; i++) {
      const usr = parsedData.users[i];
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
    const parsedNames = JSON.parse(names);
    app.names = parsedNames.names;
  });
  fs.readFile('./items/brands.json', 'utf8', function(err, brands) {
    if (err) {
      return console.log(err);
    }
    const parsedBrands = JSON.parse(brands);
    app.brands = parsedBrands.brands;
  });
  fs.readFile('./items/designs.json', 'utf8', function(err, designs) {
    if (err) {
      return console.log(err);
    }
    const parsedDesigns = JSON.parse(designs);
    app.designs = parsedDesigns.designs;
  });
  fs.readFile('./items/groups.json', 'utf8', function(err, groups) {
    if (err) {
      return console.log(err);
    }
    const parsedGroups = JSON.parse(groups);
    app.groups = parsedGroups.groups;
  });
  fs.readFile('./items/sizes.json', 'utf8', function(err, sizes) {
    if (err) {
      return console.log(err);
    }
    const parsedSizes = JSON.parse(sizes);
    app.sizes = parsedSizes.sizes;
  });
  converter.fromFile("./server/item.csv", function(err, result) {
    app.itemslist = result;
  });
  function getAccessToken(username) {
    const users = app.parsedData.users;
    let selectedUser;
    for (let i = 0, l = users.length; i < l; i++) {
      const usr = users[i];
      if(usr.username === username) {
        selectedUser = usr;
        break;
      }
    }
    return selectedUser.access_token;
  };
  function makeRequest(url, options) {
    let appendSymbol = '?';
    if(url.indexOf('?')!== -1) {
      appendSymbol = '&';
    }
    url = `https://www.zohoapis.com/books/v3${url}${appendSymbol}organization_id=${app.parsedData.organization_id}`;
    const accessToken = getAccessToken(options.username);
    options.headers = {
      Authorization: 'Zoho-oauthtoken '+accessToken
    };
    
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url, options);
        const parsedResponse = await response.json();
        if (parsedResponse.code === 0) {
          resolve(parsedResponse);
        } else {
          console.log(chalk.red(`Error in URL ${url}`, parsedResponse.message));
          reject(parsedResponse.message);
        }
        resolve(parsedResponse);
      } catch(e) {
        console.log(chalk.red(`Error in URL ${url}`, e));
        reject('Error in connection');
      }
    });
  };
  app.all('/api/itemslist', function(req, res) {
    res.json({
      items: app.itemslist
    });
  });
  app.all('/api/login', function(req, res) {
    const users = app.parsedData.users;
    const body = JSON.parse(req.body);
    let user;
    for (let i = 0, l = users.length; i < l; i++) {
      const usr = users[i];
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
  app.all('/api/salespersons', async function(req, res) {
    const url = '/invoices/editpage';
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json({
        message: 'success',
        salespersons: json.salespersons
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/invoices', async function(req, res) {
    const url = '/invoices?is_quick_create=true';
    try {
      const json = await makeRequest(url,  {
        method: 'POST',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success',
        entity_number: json.invoice.invoice_number
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/updateinvoice', async function(req, res) {
    const url = `/invoices/${req.query.invoice_id}`;
    try {
      const json = await makeRequest(url,  {
        method: 'PUT',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success',
        entity_number: json.invoice.invoice_number
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/creditnotes', async function(req, res) {
    const url = '/creditnotes';
    try {
      const json = await makeRequest(url,  {
        method: 'POST',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success',
        entity_number: json.creditnote.creditnote_number
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/invoiceslist', async function(req, res) {
    const url = `/invoices?status=unpaid&page=1&per_page=200&customer_id=${app.parsedData.customer_id}`;
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json(json);
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/creditnoteslist', async function(req, res) {
    //const url = `/creditnotes?status=open&page=1&per_page=200&customer_id=${app.parsedData.customer_id}&formatneeded=true`;
    const url = '/creditnotes?filter_by=Status.Open&page=1&per_page=200&formatneeded=true';
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json(json);
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/payments', async function(req, res) {
    const url = '/customerpayments';
    try {
      const json = await makeRequest(url,  {
        method: 'POST',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success',
        payment_id: json.payment.payment_id
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/applycredits', async function(req, res) {
    const url = `/creditnotes/${req.query.creditnote_id}/invoices`;
    try {
      const json = await makeRequest(url,  {
        method: 'POST',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success'
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/searchinvoice', async function(req, res) {
    let url = `/invoices?status=unpaid&invoice_number_contains=${req.query.invoice_number}`;
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      url = '/invoices/' + json.invoices[0].invoice_id;
      const secondJson = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json(secondJson);
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/vendors', async function(req, res) {
    const url = '/contacts?filter_by=Status.ActiveVendors';
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json({
        message: 'success',
        contacts: json.contacts
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/itemcustomfields', async function(req, res) {
    const url = '/settings/preferences/customfields?entity=item&is_entity_edit=true';
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json({
        message: 'success',
        custom_fields: json.customfields
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/items', async function(req, res) {
    const cfParams = req.query.cf_params;
    let cfParamString = '';
    for (let key in cfParams) {
      if (cfParams.hasOwnProperty(key)) {
        cfParamString = `${cfParamString}${key}=${cfParams[key]}&`
      }
    }
    const url = `/items?${cfParamString}page=${req.query.page}`;
    try {
      const json = await makeRequest(url,  {
        method: 'GET',
        username: req.query.username
      });
      res.json({
        message: 'success',
        items: json.items,
        has_more_page: json.page_context.has_more_page
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/newitem', async function(req, res) {
    const url = '/items';
    try {
      const json = await makeRequest(url,  {
        method: 'POST',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success',
        item: json.item
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/newbill', async function(req, res) {
    const url = '/bills';
    try {
      const json = await makeRequest(url,  {
        method: 'POST',
        body: req.body,
        username: req.query.username
      });
      res.json({
        message: 'success',
        bill: json.bill
      });
    } catch(message) {
      res.json({
        message: 'failure',
        error: message
      });
    }
  });
  app.all('/api/newattribute', function(req, res) {
    const body = JSON.parse(req.body);
    const attribute = body.attribute;
    const searchText = body.searchText;
    const files = {
      names: './items/names.json',
      groups: './items/groups.json',
      sizes: './items/sizes.json',
      designs: './items/designs.json',
      brands: './items/brands.json'
    };
    app[attribute].push(searchText);
    const fileName = files[attribute];
    groups = fs.readFileSync(fileName, 'utf8');
    const parsedData = JSON.parse(groups);
    parsedData[attribute].push(searchText);
    fs.writeFileSync(fileName, JSON.stringify(parsedData));
    res.json({
      message: 'attribute added successfully'
    })
  });
  app.all('/api/itemsupdate', async function(req, res) {
    const body = JSON.parse(req.body);
    const items = body.items || [];
    const promises = items.map(function(item) {
      const apiurl = `/items/${item['Item ID']}`;
      return new RSVP.Promise(async (resolve, reject) => {
        try {
          const json = await makeRequest(apiurl,  {
            method: 'PUT',
            body: JSON.stringify({
              rate: item.printRate
            }),
            username: req.query.username
          });
          resolve({
            message: 'success'
          });
        } catch(message) {
          resolve({
            message: 'failure',
            error: {
              message: message,
              sku: item.SKU
            }
          });
        }
      });
    });
    try {
      const results = RSVP.all(promises);
      const failedItems = results.filter(function(failedItem) {
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
    } catch(message) {
      res.json({
        message: reason.message
      })
    }
  });
  app.all('/api/adjustment', function(req, res) {
    const body = JSON.parse(req.body);
    const items = body.items;
    const date = body.date;
    let newItems,newItemsCSV, currentItem, adjustmentsCSV, itemsPromise, adjustmentsPromise;
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
        const lastRefNumber = Number((adjustments[adjustments.length - 1] || {})['Reference Number Int'] || 0);
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
    const items = app.itemslist;
    let newItems,newItemsCSV, currentItem, oldStock, incomingStock, newStock;
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
    const body = JSON.parse(req.body);
    const items = body.items;
    const printItems = body.printItems;
    const importItemsPromise = json2CSVConverter.json2csvAsync(items).then((newItemsCSV) => {
        new RSVP.Promise((resolve, reject) => {
          fs.writeFileSync('./csvs/importitem.csv', newItemsCSV);
          fs.unlinkSync('./csvs/newitem.csv');
          resolve(newItems);
        })
    });
    const printItemsPromise = json2CSVConverter.json2csvAsync(printItems).then((printItemsCSV) => {
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
      const parsedCount = JSON.parse(allcount);
      res.json({
        count: parsedCount,
        message: 'success',
      });
    }); 
  });
  app.all('/api/newcount', function(req, res) {
    const body = JSON.parse(req.body);
    const count_id = body.count_id;
    const total = body.total;
    fs.writeFileSync('./count/'+count_id+'.json', JSON.stringify(body));
    const allcount = fs.readFileSync('./count/allcount.json', 'utf8');
    const parsedData = JSON.parse(allcount);
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
      const parsedCount = JSON.parse(allcount);
      res.json({
        count: parsedCount,
        message: 'success',
      });
    }); 
  });
  app.all('/api/updatecount', function(req, res) {
    const body = JSON.parse(req.body);
    const count_id = body.count_id;
    const total = body.total;
    const allcount = fs.readFileSync('./count/allcount.json', 'utf8');
    const parsedData = JSON.parse(allcount);
    const oldCount = parsedData['counts'].find(count => count.count_id === count_id);
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
    const body = JSON.parse(req.body);
    const count_id = body.count_id;
    const allcount = fs.readFileSync('./count/allcount.json', 'utf8');
    const parsedData = JSON.parse(allcount);
    const newCounts = parsedData['counts'].filter(count => count.count_id !== count_id);
    parsedData.counts = newCounts;
    fs.unlinkSync('./count/'+count_id+'.json');
    fs.writeFileSync('./count/allcount.json', JSON.stringify(parsedData));
      res.json({
        message: 'count added successfully'
      })
  });
  // app.all('/api/invoicepdf', function(req, res) {
  //   const invoiceId = req.query.invoice_id;
  //   const url = 'https://www.zohoapis.com/books/v3/invoices/' + invoiceId + '?print=true&accept=pdf&organization_id=' + app.parsedData.organization_id + '&customer_id=' + app.parsedData.customer_id;
  //   const fileName = "pdf/invoice-" + invoiceId + ".pdf";
  //   const file = fs.createWriteStream(fileName);
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
