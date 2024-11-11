'use strict';

const fs = require('fs');
const glob = require('glob');
const request = require('request');
const oauth = require('../server/oauth');

if (fs.existsSync('./server/item.csv')) {
  console.log('Items file already exists, not downloading.');
  process.exit(0);
}

console.log('Items file does not exist, downloading.');
fs.readFile('./server/royal.json', 'utf8', async function(err, data) {
  if (err) {
    console.error('Error reading royal.json:', err);
    process.exit(1);
  }

  try {
    const parsedData = JSON.parse(data);
    for (let i = 0, l = parsedData.users.length; i < l; i++) {
      const usr = parsedData.users[i];
      if (usr.is_admin) {
        const json = await oauth.generateAccessToken(usr, false);
        const url = `https://www.zohoapis.com/books/v3/export?entity=item&accept=csv&status=&organization_id=${parsedData.organization_id}`;
        request.get({
          url,
          headers: {
            Authorization: 'Zoho-oauthtoken ' + json.access_token
          }
        }).pipe(fs.createWriteStream('./server/item.csv'));
      }
    }
  } catch (err) {
    console.error('Error processing data:', err);
    process.exit(1);
  }
});