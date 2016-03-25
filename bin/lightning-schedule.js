#! /usr/bin/env node

var program   = require('commander'),
    moment    = require('moment'),
    validUrl  = require('valid-url');

var outputSuccessMessage  = require('./output').outputSuccessMessage;
var ErrorMessages         = require('../lightning/error-messages');
var lightning             = require('../');

const FIVE_MINUTES_IN_MILLISECONDS  = moment.duration(5, 'minutes').asMilliseconds();
const A_DAY_IN_MILLISECONDS         = moment.duration(1, 'days').asMilliseconds();
const UTC_NOW_TIMESTAMP             = parseInt(moment.utc().format('x')); //as milliseconds

function parseMomentIntervalToTimestamp(momentInterval) {
  var durationArgs = momentInterval.split('-');
  if (durationArgs.length != 2) throw new Error(ErrorMessages.INVALID_MOMENT_INTERVAL);

  durationArgs[0] = parseFloat(durationArgs[0]);
  if (isNaN(durationArgs[0])) throw new Error(ErrorMessages.INVALID_MOMENT_INTERVAL);

  return moment.duration.apply(this, durationArgs).asMilliseconds();
}

function parseIsoDateToTimestamp(isoDate) {
  var momentDate = moment(isoDate);
  if (!momentDate.isValid()) throw new Error(ErrorMessages.INVALID_DATE);

  return parseInt(momentDate.format('x')); //as milliseconds
}

function parseTimestamp(timestamp) {
  timestamp = parseInt(timestamp);
  if (isNaN(timestamp)) throw new Error(ErrorMessages.INVALID_TIMESTAMP);

  return timestamp;
}

function getFormattedSuccessMessage(targetUrl, interval, start) {
  var humanInterval = moment.duration(interval).humanize();
  var humanStartDate = moment(start).fromNow();

  return targetUrl + ' will be scanned every ' + humanInterval + ' starting ' + humanStartDate;
}

function scheduleScan(targetUrl) {
  if (!targetUrl || typeof targetUrl != "string" || !validUrl.isWebUri(targetUrl)) throw new Error(ErrorMessages.INVALID_URL);
  var interval = program.every || program.interval || A_DAY_IN_MILLISECONDS;
  var start = program.startDate || program.startStamp || UTC_NOW_TIMESTAMP;

  if (interval < FIVE_MINUTES_IN_MILLISECONDS) throw new Error(ErrorMessages.MINIMUM_INTERVAL_NOT_RESPECTED);

  lightning.schedule(targetUrl, interval, start)
    .then(outputSuccessMessage.bind(this, getFormattedSuccessMessage(targetUrl, interval, start)))
    .fail(function (message) {
      console.log(ErrorMessages.SCHEDULING_FAILED, message)
    });
}

try {
  program
    .description('scheduling CLI')
    .option('-i --interval <timestamp>', 'milliseconds time interval between each scan. alternative to --every, defautls to one day', parseTimestamp)
    .option('-ss --start-stamp <timestamp>', 'milliseconds timestamp specifying when does the scanning process should start', parseTimestamp)
    .option('-e --every <string>', 'time interval between each scan with respect to moment.js durations e.g: 30-minutes will override --interval, defaults to one day', parseMomentIntervalToTimestamp)
    .option('-s --start-date <string>', 'ISO 8601 formatted date when the start the scanning process. will override --start-stamp, defauls to today', parseIsoDateToTimestamp)
    .action(scheduleScan)
    .parse(process.argv);
} catch (err) {
  console.error(err.message);
}
