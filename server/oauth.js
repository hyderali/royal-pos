const RSVP = require('rsvp');
const fetch = require('node-fetch');
const chalk = require('chalk');
const fs = require('fs');
let CLIENT_ID = '';
let CLIENT_SECRET = '';
fs.readFile('./server/royal.json', 'utf8', async function (err, data) {
  if (err) {
    return console.log(err);
  }
  const parsedData = JSON.parse(data);
  CLIENT_ID = parsedData.client_id;
  CLIENT_SECRET = parsedData.client_secret;
});
module.exports = {
  generateAccessToken: function (user, shouldRegenerate) {
    const REDIRECT_URI = 'https://www.zoho.com/books';
    console.log(
      chalk.blue(`Generating access token for user - ${user.username}`)
    );
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        // if (user.access_token) {
        //   console.log(
        //     chalk.green(
        //       `\nReturning already generated token for user - ${user.username}\n\n`
        //     )
        //   );
        //   resolve(user);
        //   return;
        // }
        const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${user.refresh_token}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&grant_type=refresh_token`;
        const response = await fetch(url, { method: 'POST' });
        const parsedResponse = await response.json();
        if (!parsedResponse.access_token) {
          console.log(
            chalk.green(
              `\nAccess token not generated for user - ${user.username}\n\n`
            )
          );
          return this.generateAccessToken(user, shouldRegenerate);
        }
        console.log(
          chalk.green(
            `\nAccess token generated for user - ${user.username} - ${parsedResponse.access_token}\n\n`
          )
        );
        user.access_token = parsedResponse.access_token;
        if (shouldRegenerate) {
          setTimeout(() => {
            this.generateAccessToken(user, true);
          }, 1000 * 60 * 50);
        }
        resolve(parsedResponse);
      } catch {
        console.log(chalk.red('Error in generating oath - ', e));
        reject('Error in generating oath');
      }
    });
  },
};
