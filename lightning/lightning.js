var request = require('request'),
    Q       = require('q');

const API_GATEWAY_TIMEOUT = 'Endpoint request timed out';

const LIGHTNING_SCHEDULE_URL = 'https://nsflshddgh.execute-api.us-east-1.amazonaws.com/prod/scans/scheduled';
const LIGHTNING_TASK_URL = 'https://nsflshddgh.execute-api.us-east-1.amazonaws.com/prod/scan';

//TODO validate arguments
module.exports.scan = function (targetUrl) {
  var deferred = Q.defer();

  var requestOptions = {
    json: {url: targetUrl}
  };

  request.post(LIGHTNING_TASK_URL, requestOptions, function (err, httpResponse, body) {
    if (err) deferred.reject(err.message);
    else if (body.message && body.message != API_GATEWAY_TIMEOUT) deferred.reject(body.message);
    else if (body.message == API_GATEWAY_TIMEOUT) { // API GATEWAY TIMES OUT AFTER 10 seconds
      deferred.resolve({message: "Scan completed, but no data available", metrics: {}});
    } else if (body.metrics) deferred.resolve({message: "Scan completed", metrics: body.metrics});
  });

  return deferred.promise;
};

//TODO validate arguments
module.exports.schedule = function (targetUrl, interval, startTime) {
  var deferred = Q.defer();

  var requestOptions = {
    json: {
      url: targetUrl,
      period: interval,
      nextRun: startTime
    }
  };

  request.post(LIGHTNING_SCHEDULE_URL, requestOptions, function (err, httpResponse, body) {
    if (err) deferred.reject(err.message);
    else if (body.message) deferred.reject(body.message);
    else deferred.resolve(requestOptions.json);
  });

  return deferred.promise;
};
