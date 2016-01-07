#! /usr/bin/env node

var program = require('commander');

program
  .version('0.1.0')
  .option('-u, --url [value]', 'url to scan')
  .parse(process.argv);

console.log('piping scan of %s to phantomas', program.url);