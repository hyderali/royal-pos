var RSVP = require('rsvp');
var request = require('request');
module.exports = {
  generateAccessToken: function(user, shouldRegenerate){
    var CLIENT_ID = '1000.J38XOSGCRSAQNV6J98YSKQD4DVW3ZD';
    var CLIENT_SECRET = 'a1c8125886e47e867bf54b7e138dfa0c5d98235238';
    var REDIRECT_URI = 'https://www.zoho.com/books';
    let self = this;
    return new RSVP.Promise((resolve, reject) => {
      var url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${user.refresh_token}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&grant_type=refresh_token`
      request.post({
        url: url
      }, function(err, httpResponse, response) {
        try {
          var parsedResponse = JSON.parse(response);
          user.access_token = parsedResponse.access_token;
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
