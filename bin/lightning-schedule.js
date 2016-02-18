#! /usr/bin/env node

var program = require('commander'),
    moment  = require('moment');

var lightning = require('../');
var outputSuccessMessage = require('./output').outputSuccessMessage;

const A_DAY_IN_MILLISECONDS   = moment.duration(1, 'days').asMilliseconds();
const UTC_NOW_TIMESTAMP       = parseInt(moment.utc().format('x')); //in milliseconds

function scheduleScan(targetUrl) {
  if (!targetUrl || typeof targetUrl != "string") console.log('a valid target URL needs to be specified');
  else {
    lightning.schedule(targetUrl, parseInt(program.interval), parseInt(program.start))
      .then(function () {
        outputSuccessMessage(targetUrl + ' will be scanned every ' + program.interval + ' starting ' + program.start);
      })
      .fail(function (message) {
        console.log('an error occurred with your scheduling', message)
      })
  }
}

program
  .description('scheduling CLI')
  .option('-i --interval <n>', 'time interval between each scan', A_DAY_IN_MILLISECONDS)
  .option('-s --start <n>', 'time interval between each scan', UTC_NOW_TIMESTAMP)
  .action(scheduleScan)
  .parse(process.argv);
