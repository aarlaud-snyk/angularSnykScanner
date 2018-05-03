#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var isRelative = require('is-relative');
var path = require('path');
var utils = require('./utils.js');
var snykAPI = require('./snykAPI.js');
var filePath;
var tmpFolderPath = __dirname+'/tmp/';
var templatesFolderPath = __dirname+'/templates/';
var rimraf = require('rimraf');
const fs = require('fs');


if (!fs.existsSync(tmpFolderPath)){
        fs.mkdirSync(tmpFolderPath);
} else {
  // rimraf(tmpFolderPath, function () {
  //   console.log('tmp folder cleared');
  // });
}

if (argv.i) { // output destination
  if(isRelative(argv.i)){
    filePath = path.join(__dirname, argv.i);
  } else {
    filePath = argv.i;
  }
  console.log(filePath);
} else {
  console.error("Expecting a file path with -i <filePath> to the angular produced file.");
  process.exit();
}

//utils.readInputFromFile(filePath, (data) => {console.log(data);});
utils.extractDependenciesList(filePath, (depArray) => {

  //fs.createReadStream(templatesFolderPath+'package.json');
  fs.readFile(templatesFolderPath+'package.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    var packageFile = JSON.parse(data);
    depArray.forEach((dep) => {
      packageFile.dependencies[dep.name] = dep.version
    });

    fs.writeFile(tmpFolderPath+'package.json', JSON.stringify(packageFile), 'utf8', () => {
      var packageJSON = require(tmpFolderPath+'package.json');
      snykAPI.test("npm", packageJSON, (data) => {
        console.log(JSON.stringify(data,undefined, 4));
      });
    });

  });


});
