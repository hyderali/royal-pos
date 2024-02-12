var fs = require('fs');
var glob = require('glob');
var request = require('request');
var oauth = require('../server/oauth');
if (fs.existsSync('./server/item.csv')) {
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
      let json = await oauth.generateAccessToken(usr, false);
      var url = 'https://www.zohoapis.com/books/v3/export?entity=item&accept=csv&status=&organization_id=' + parsedData.organization_id;
      request.get({
        url,
        headers: {
          Authorization: 'Zoho-oauthtoken '+json.access_token
        }
      }).pipe(fs.createWriteStream('./server/item.csv'));
    }
  }
});
