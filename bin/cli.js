#! /usr/bin/env node

var program = require('commander');

var path = require('path');
var pkg = require(path.join(__dirname, '../package.json'));

var scan = require('../lib/PhantomasWrapper.js').scan;

program
  .version(pkg.version)
  .option('-u, --url <url>', 'url to scan')
  .parse(process.argv);

scan(program.url);