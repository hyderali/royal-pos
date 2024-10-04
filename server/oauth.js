var RSVP = require('rsvp');
var request = require('request');
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
    return new RSVP.Promise((resolve, reject) => {
      if (user.access_token) {
        console.log(
          `Returning already generated token for user - ${user.username}\n\n`
        );
        resolve(user);
        return;
      }
      var url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${user.refresh_token}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&grant_type=refresh_token`
      console.log('Going to generate access token for user ', user.username);
      request.post({
        url: url
      }, function(err, httpResponse, response) {
        try {
          var parsedResponse = JSON.parse(response);
          if(!parsedResponse.access_token) {
            console.log('\n Access token not generated for user ', user.username);
            return self.generateAccessToken(user, shouldRegenerate);
          }
          console.log('\n Access token generated for user ', user.username);
          user.access_token = parsedResponse.access_token;
          console.log(`Access token generated for user - ${user.username} - ${parsedResponse.access_token}\n\n`);
          if(shouldRegenerate) {
            setTimeout(() => {
              self.generateAccessToken(user, true);
            }, 1000 * 60 * 50);
          }
          resolve(parsedResponse);
        } catch (e) {
          reject('Error in connection. Try again');
        }
      })
    });
  }
}
