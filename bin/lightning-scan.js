#! /usr/bin/env node

var program = require('commander'),
    request = require('request');

var outputSuccessMessage = require('../lightning/output').outputSuccessMessage;

const LIGHTNING_WEBAPP_BASE_URL = 'http://osylvain.github.io/lightning/';
const LIGHTNING_TASK_URL        = 'https://v8acs2yqh4.execute-api.us-east-1.amazonaws.com/prod/scan';

function immediateScan(targetUrl) {
  console.log('scanning ', targetUrl, ' ...');

  var requestOptions = {
    json: {url: targetUrl}
  };

  // TODO: wrap request in a promise and extract to a index.js module so lightning can be called by via node
  request.post(LIGHTNING_TASK_URL, requestOptions, function (err, httpResponse, body) {
      if (err) return console.error('Oups, somethig went wrong while scanning ...', err.message)
      else if(body.message == 'Endpoint request timed out') { // API GATEWAY TIMES OUT AFTER 10 seconds
        outputSuccessMessage('Perf scan not complete yet, your results will likely be available at ' + LIGHTNING_WEBAPP_BASE_URL + ' in less than a minute');
      } else if(body.metrics) {
        outputSuccessMessage('Perf scan complete, go check your results at ' + LIGHTNING_WEBAPP_BASE_URL);
        for (metric in body.metrics) {
          console.log(metric, ' : ', body.metrics[metric]);
        }
      }
    });
}

program
  .description('scan CLI')
  .action(immediateScan)
  .parse(process.argv);
