const readline = require('readline');
const fs = require('fs');

module.exports = {readInputFromFile: readInputFromFile, extractDependenciesList:extractDependenciesList };

function readInputFromFile(source, callback) {
  fs.readFile(source, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    callback(data);
  });
}

function extractDependenciesList(filePath, callback){
  var dependenciesArray = [];
  var parsedDependenciesList = [];
  var re = /.*@[0-9.]+/i;
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    if(line.match(re)){
      dependenciesArray.push(line);
    }
  });

  rl.on('close', () => {


    dependenciesArray.forEach((dep) => {

      var re = /(.*)@(.*)/i;

      dep.replace(re, function(match, name, version) {
          parsedDependenciesList.push({name:name, version:version});
      });
      
    });

    callback(parsedDependenciesList);
  })
}
