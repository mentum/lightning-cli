#! /usr/bin/env node

var program = require('commander');

var path = require('path');
var pkg = require(path.join(__dirname, '../package.json'));

var lightning = require('../lib/lightning.js');

program
  .version(pkg.version)
  .description('Lightning for developers')
  .arguments('<url>')
  .action(function (url) {
    // TODO validate url with regex

    // TODO Extract this and make it generic
    var options = {};
    options.verbose = !!program.verbose;

    if(url) lightning.scan(url, options);
    // TODO handle errors gracefully
  })
  .option('-v, --verbose', 'Verbose output')
  .parse(process.argv);

if (!program.args.length) program.help();