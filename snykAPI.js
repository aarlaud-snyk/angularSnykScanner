var axios = require('axios');
module.exports = {test: test};

const config = require('./config.json');

axios.defaults.baseURL = 'https://snyk.io/api/v1/test/';
axios.defaults.headers.common['Authorization'] = config.SNYKTOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
var org = '?org='+config.SNYKORG;

function test(packageManager, packageJSON, callback){

  var body = {
    "encoding": "plain",
    "files": {
      "target": {
        "contents": JSON.stringify(packageJSON)
      }
    }
  }

  axios.post('/npm'+org,body)
  .then(function (response) {
    // console.log(response.data);
    callback(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });
}
