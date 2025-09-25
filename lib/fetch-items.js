const fs = require('fs');
const fetch = require('node-fetch');
const oauth = require('../server/oauth');
const RSVP = require('rsvp');
if (fs.existsSync('./server/item.json')) {
  console.log('Items file already exists, not downloading.');
  return;
}
console.log('Items file does not exist, downloading.');
fs.readFile('./server/royal.json', 'utf8', async function (err, data) {
  if (err) {
    return console.log(err);
  }
  const parsedData = JSON.parse(data);
  for (let i = 0, l = parsedData.users.length; i < l; i++) {
    const usr = parsedData.users[i];
    if (usr.is_admin) {
      const json = await oauth.generateAccessToken(usr, false);
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
    }
  }
});
async function getItems(page, access_token, organization_id) {
  return new RSVP.Promise((resolve, reject) => {
    fetch(`https://www.zohoapis.com/books/v3/items/bulkfetch?per_page=25000&page=${page}&filter_by=Status.Active&organization_id=${organization_id}`, {
      headers: {
        Authorization: 'Zoho-oauthtoken ' + access_token,
      },
    }).then((res) => {
      resolve(res.json());
    });
  });
}
