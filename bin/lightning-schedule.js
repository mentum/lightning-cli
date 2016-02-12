#! /usr/bin/env node

var program = require('commander'),
    request = require('request'),
    moment  = require('moment');

var outputSuccessMessage = require('../lightning/output').outputSuccessMessage;

const LIGHTNING_SCHEDULE_URL  = 'https://v8acs2yqh4.execute-api.us-east-1.amazonaws.com/prod/scheduled';
const A_DAY_IN_MILLISECONDS   = moment.duration(1, 'days').asMilliseconds();
const UTC_NOW_TIMESTAMP       = parseInt(moment.utc().format('x')); //in milliseconds

////  TODO post to lightning schedule endpoint
////  POST https://amazon-api-gateway-shitty-url-stuff-gay/scans/schedule
function scheduleScan(targetUrl) {
  if (!targetUrl || typeof targetUrl != "string") console.log('a valid target URL needs to be specified');
  else {
    console.log('scheduling a recurring scan to ', targetUrl, ' every ', program.interval, ' starting ', program.start, ' ...');

    var requestOptions = {
      json: {
        url: targetUrl,
        period: parseInt(program.interval),
        nextRun: parseInt(program.start)
      }
    };

    request.post(LIGHTNING_SCHEDULE_URL, requestOptions, function (err, httpResponse, body){
      if (err) console.log('an error occurred with your scheduling');
      else {
        console.log(body);
        outputSuccessMessage(targetUrl + ' will be scanned every ' + program.interval  + ' starting ' + program.start);
      }
    })
  }
}

program
  .description('scheduling CLI')
  .option('-i --interval <n>', 'time interval between each scan', A_DAY_IN_MILLISECONDS)
  .option('-s --start <n>', 'time interval between each scan', parseInt, UTC_NOW_TIMESTAMP)
  .action(scheduleScan)
  .parse(process.argv);
