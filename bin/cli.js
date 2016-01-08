#! /usr/bin/env node

var program = require('commander');
var request = require('request');
var API_GATEWAY_URL = 'https://lbqynnnm91.execute-api.us-east-1.amazonaws.com/lightning/scan';

var path = require('path');
var pkg = require(path.join(__dirname, '../package.json'));

var lightning = require('../lib/lightning.js');

program
  .version(pkg.version)
  .description('Lightning for developers')
  .arguments('<url>')
  .action(function (url) {
    // TODO validate url with regex
    request.post({url: API_GATEWAY_URL, json: {url: url}}, function (err, httpResponse, body) {
      // TODO handle errors gracefully
      if (err) {
        return console.error('error: ', err);
      }
      console.log('your data:', body);
    });
  })
  .option('-v, --verbose', 'Verbose output')
  .parse(process.argv);

if (!program.args.length) program.help();