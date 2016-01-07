#! /usr/bin/env node

var program = require('commander');

var path = require('path');
var pkg = require( path.join(__dirname, '../package.json') );

program
  .version(pkg.version)
  .option('-u, --url [value]', 'url to scan')
  .parse(process.argv);

console.log('piping scan of %s to phantomas', program.url);