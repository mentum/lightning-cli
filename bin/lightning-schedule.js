#! /usr/bin/env node

var program = require('commander'),
    moment  = require('moment');

var lightning = require('../');
var outputSuccessMessage = require('./output').outputSuccessMessage;

const A_DAY_IN_MILLISECONDS   = moment.duration(1, 'days').asMilliseconds();
const UTC_NOW_TIMESTAMP       = parseInt(moment.utc().format('x')); //in milliseconds

function parseIntervalToMilliseconds(interval) {
  var durationArgs = interval.split('-');
  if(durationArgs.length != 2) throw new Error('badly formatted interval');

  durationArgs[0] = parseFloat(durationArgs[0]);
  return moment.duration.apply(this, durationArgs).asMilliseconds();
}

function parseIsoDateToTimestamp(date) {
  return parseInt(moment(date).format('x')); //in milliseconds
}

function scheduleScan(targetUrl) {
  if (!targetUrl || typeof targetUrl != "string") console.log('a valid target URL needs to be specified');
  else {
    var interval = program.every ? parseIntervalToMilliseconds(program.every) : program.interval;
    var start = program.startDate? parseIsoDateToTimestamp(program.startDate) : program.startStamp;

    lightning.schedule(targetUrl, interval, start)
      .then(function () {
        outputSuccessMessage(targetUrl + ' will be scanned every ' + (program.every || interval) + ' starting ' + (program.startDate || start));
      })
      .fail(function (message) {
        console.log('an error occurred with your scheduling', message)
      })
  }
}
program
  .description('scheduling CLI')
  .option('-i --interval <number>', 'milliseconds time interval between each scan. alternative to --every, defautls to one day', parseInt, A_DAY_IN_MILLISECONDS)
  .option('-ss --start-stamp <number>', 'milliseconds timestamp specifying when does the scanning process should start', parseInt, UTC_NOW_TIMESTAMP)
  .option('-e --every <string>', 'time interval between each scan with respect to moment.js durations e.g: 30-minutes will override --interval, defaults to one day')
  .option('-s --start-date <string>', 'ISO 8601 formatted date when the start the scanning process. will override --start-stamp, defauls to today')
  .action(scheduleScan)
  .parse(process.argv);
