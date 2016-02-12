var Q = require('q');

const LIGHTNING_TASK_URL        = 'https://v8acs2yqh4.execute-api.us-east-1.amazonaws.com/prod/scan';

module.exports.scan = function (targetUrl) {
  var deferred = Q.defer();

  var requestOptions = {
    json: {url: targetUrl}
  };

  request.post(LIGHTNING_TASK_URL, requestOptions, function (err, httpResponse, body) {
    if (err) return console.error('Oups, somethig went wrong while scanning ...', err.message)
    else if (body.message == 'Endpoint request timed out') { // API GATEWAY TIMES OUT AFTER 10 seconds
      outputSuccessMessage('Perf scan not complete yet, your results will likely be available at ' + LIGHTNING_WEBAPP_BASE_URL + ' in less than a minute');
    } else if (body.metrics) {
      outputSuccessMessage('Perf scan complete, go check your results at ' + LIGHTNING_WEBAPP_BASE_URL);
      for (metric in body.metrics) {
        console.log(metric, ' : ', body.metrics[metric]);
      }
    }
  });
}
}
;
