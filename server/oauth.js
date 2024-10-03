var RSVP = require('rsvp');
var fetch = require('node-fetch');
var chalk = require('chalk');
var fs = require('fs');
var CLIENT_ID = '';
var CLIENT_SECRET = '';
fs.readFile('./server/royal.json', 'utf8', async function(err, data) {
  if (err) {
    return console.log(err);
  }
  var parsedData = JSON.parse(data);
  CLIENT_ID = parsedData.client_id;
  CLIENT_SECRET = parsedData.client_secret;
});
module.exports = {
  generateAccessToken: function(user, shouldRegenerate){
    var REDIRECT_URI = 'https://www.zoho.com/books';
    let self = this;
    console.log(chalk.blue(`Generating access token for user - ${user.username}`));
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        var url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${user.refresh_token}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&grant_type=refresh_token`;
        var response = await fetch(url, { method: 'POST' });
        var parsedResponse = await response.json();
        if(!parsedResponse.access_token) {
          console.log(chalk.green(`\nAccess token not generated for user - ${user.username}\n\n`));
          return this.generateAccessToken(user, shouldRegenerate);
        }
        console.log(chalk.green(`\nAccess token generated for user - ${user.username}\n\n`));
        user.access_token = parsedResponse.access_token;
        if(shouldRegenerate) {
          setTimeout(() => {
            self.generateAccessToken(user, true);
          }, 1000 * 60 * 50);
        }
        resolve(parsedResponse);
      } catch {
        console.log(chalk.red('Error in generating oath - ', e));
        reject('Error in generating oath');
      }
    });
  }
}
