var request = require('request'),
    Q       = require('q');

const LIGHTNING_BASE_API_URL  = 'https://nsflshddgh.execute-api.us-east-1.amazonaws.com/';
const API_GATEWAY_TIMEOUT     = 'Endpoint request timed out';
const DEFAULT_API_VERSION     = 'prod';
const SCHEDULE_ENDPOINT       = '/scans/scheduled';
const SCAN_ENDPOINT           = '/scan';

module.exports.scan = function (targetUrl, experimental) {
  var deferred = Q.defer();
  var scanUrl = LIGHTNING_BASE_API_URL + (experimental ? 'staging' : DEFAULT_API_VERSION) + SCAN_ENDPOINT;

  var requestOptions = {
    json: {url: targetUrl}
  };

  request.post(scanUrl, requestOptions, function (err, httpResponse, body) {
    if (err) deferred.reject(err.message);
    else if (body.message && body.message != API_GATEWAY_TIMEOUT) deferred.reject(body.message);
    else if (body.message == API_GATEWAY_TIMEOUT) { // API GATEWAY TIMES OUT AFTER 10 seconds
      deferred.resolve({message: "Scan completed, but no data available", metrics: {}});
    } else if (body.metrics) deferred.resolve({message: "Scan completed", metrics: body.metrics});
  });

  return deferred.promise;
};

module.exports.schedule = function (targetUrl, interval, startTime) {
  var deferred = Q.defer();
  var scanUrl = LIGHTNING_BASE_API_URL + DEFAULT_API_VERSION + SCHEDULE_ENDPOINT;

  var requestOptions = {
    json: {
      url: targetUrl,
      period: interval,
      nextRun: startTime
    }
  };

  request.post(scanUrl, requestOptions, function (err, httpResponse, body) {
    if (err) deferred.reject(err.message);
    else if (body.message) deferred.reject(body.message);
    else deferred.resolve(requestOptions.json);
  });

  return deferred.promise;
};
