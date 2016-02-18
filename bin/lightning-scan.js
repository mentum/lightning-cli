#! /usr/bin/env node

var program = require('commander');

var lightning = require('../');
var outputSuccessMessage = require('./output').outputSuccessMessage;

const LIGHTNING_WEBAPP_BASE_URL = 'http://mentum.github.io/lightning/';

function immediateScan(targetUrl) {
  if (!targetUrl || typeof targetUrl != "string") console.log('a valid target URL needs to be specified');
  else {
    console.log('scanning ', targetUrl, ' ...');
    lightning.scan(targetUrl)
      .then(function(data){
        if(data.metrics) {
          outputSuccessMessage('Performance scan complete, go check your results at ' + LIGHTNING_WEBAPP_BASE_URL);
          if(program.verbose) for (metric in data.metrics) console.log(metric, ' : ', data.metrics[metric]);
        } else {
          outputSuccessMessage('Performance scan not complete yet, your results will likely be available at ' + LIGHTNING_WEBAPP_BASE_URL + ' in less than a minute');
        }
      })
      .fail(function(message){
        console.error('Oops, something went wrong while scanning ...', err.message)
      });
  }
}

program
  .description('scan CLI')
  .action(immediateScan)
  .option('--verbose')
  .parse(process.argv);
