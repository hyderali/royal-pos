const fs = require('fs');
const fetch = require('node-fetch');
const oauth = require('../server/oauth');
if (fs.existsSync('./server/item.csv')) {
  console.log('Items file already exists, not downloading.');
  return;
}
console.log('Items file does not exist, downloading.');
fs.readFile('./server/royal.json', 'utf8', async function (err, data) {
  if (err) {
    return console.log(err);
  }
  const parsedData = JSON.parse(data);
  for (const i = 0, l = parsedData.users.length; i < l; i++) {
    const usr = parsedData.users[i];
    if (usr.is_admin) {
      const json = await oauth.generateAccessToken(usr, false);
      const url =
        'https://www.zohoapis.com/books/v3/export?entity=item&accept=csv&status=&organization_id=' +
        parsedData.organization_id;
      fetch(url, {
        headers: {
          Authorization: 'Zoho-oauthtoken ' + json.access_token,
        },
      }).then((res) => {
        const dest = fs.createWriteStream('./server/item.csv');
        res.body.pipe(dest);
      });
    }
  }
});
