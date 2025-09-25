var fs = require('fs');
var request = require('request');
var oauth = require('../server/oauth');
var RSVP = require('rsvp');
if (fs.existsSync('./server/item.json')) {
  console.log('Items file already exists, not downloading.');
  return;
}
console.log('Items file does not exist, downloading.');
fs.readFile('./server/royal.json', 'utf8', async function(err, data) {
  if (err) {
    return console.log(err);
  }
  var parsedData = JSON.parse(data);
  for (var i = 0, l = parsedData.users.length; i < l; i++) {
    var usr = parsedData.users[i];
    if (usr.is_admin) {
      const startTime = Date.now();
      console.log(`Starting item fetch process for admin user: ${usr.username}`);
      
      let json = await oauth.generateAccessToken(usr, false);
      let items = await getItems(1, json.access_token, parsedData.organization_id);
      const finalItems = [];
      while (items.page_context.has_more_page) {
        console.log(items.page_context.page);
        finalItems.push(...items.items);
        items = await getItems(items.page_context.page + 1, json.access_token, parsedData.organization_id);
      }
      finalItems.push(...items.items);
      console.log(finalItems.length);
      let output = '';
      finalItems.forEach(item => {
        let icf={};
        item.custom_fields.forEach(cf => {
          icf[cf.label] = cf.value;
        });
        item.CF = icf;
        output += JSON.stringify(item) + ',\n';
      });
      output = output.slice(0, -2);
      output = '[' + output + ']';
      fs.writeFileSync('./server/item.json', output);
      
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log(`Item fetch process completed for admin user: ${usr.username}`);
      console.log(`Total time taken: ${timeTaken}ms (${(timeTaken / 1000).toFixed(2)}s)`);
    }
  }
});
async function getItems(page, access_token, organization_id) {
  return new RSVP.Promise((resolve, reject) => {
    request.get(`https://www.zohoapis.com/books/v3/items/bulkfetch?per_page=25000&page=${page}&filter_by=Status.Active&organization_id=${organization_id}`, {
      headers: {
        Authorization: 'Zoho-oauthtoken ' + access_token,
      },
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
