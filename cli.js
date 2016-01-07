#! /usr/bin/env node

console.log('contents of the actual repo');

var exec = require('child_process').exec;
var child = exec('ls -a', function(err, stdout, stderr) {
  console.log(stdout);
});