var fs = require('fs');
var glob = require('glob');
var request = require('request');

fs.readFile('./server/royal.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  var parsedData = JSON.parse(data);
  var adminUser;
  for (var i = 0, l = parsedData.users.length; i < l; i++) {
    var usr = parsedData.users[i];
    if (usr.is_admin) {
      adminUser = usr;
      break;
    }
  }
  var url = 'https://books.zoho.com/api/v3/export?entity=item&accept=csv&authtoken=' + adminUser.authtoken + '&organization_id=' + parsedData.organization_id;
  request(url).pipe(fs.createWriteStream('./server/item.csv'));
});
