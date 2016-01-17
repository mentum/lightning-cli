#! /usr/bin/env node

var program = require('commander');
var request = require('request');
var path = require('path');

var LIGHTNING_TASK_URL = 'https://v8acs2yqh4.execute-api.us-east-1.amazonaws.com/prod/scan'; 

var pkg = require(path.join(__dirname, '../package.json'));

function callLightningTask(url) {
  var requestOptions = {
    json: {url: url}
  }

  request.post(LIGHTNING_TASK_URL, requestOptions, function (err, httpResponse, body) {
      // TODO handle errors gracefully
      if (err) {
        return console.error('error: ', err);
      }
      // TODO maintain this according to what's returned in the task
      console.log('Scanning done, you can download the scan results at:', body.scanResultsURL);
    });
}

program
  .version(pkg.version)
  .description('Lightning for developers')
  .arguments('<url>')
  .action(callLightningTask)
  .option('-v, --verbose', 'Verbose output')
  .parse(process.argv);

if (!program.args.length) program.help();