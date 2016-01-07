var phantomas = require('phantomas'),
    aws       = require('aws-sdk'),
    uuid      = require('uuid');

const IMPORTANT_METRICS = ['requests',
  'bodySize',
  'contentLength',
  'httpTrafficCompleted',
  'timeToFirstByte',
  'timeToLastByte',
  'htmlCount',
  'htmlSize',
  'cssCount',
  'cssSize',
  'jsCount',
  'jsSize',
  'jsErrors',
  'domComplete',
  'biggestLatency',
  'cacheHits',
  'imageCount',
  'imageSize'
];

var AWS_CREDENTIALS = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
  apiVersion: process.env.AWS_API_VERSION
};

const CLOUDWATCH_NAMESPACE = 'lightning test';
var cloudwatch = new aws.CloudWatch(AWS_CREDENTIALS);

function _pushToCloudWatch(metricData) {
  var cloudwatchMetric = {
    Namespace: CLOUDWATCH_NAMESPACE,
    MetricData: metricData
  };

  cloudwatch.putMetricData(cloudwatchMetric, function(err, data) {
    if(err)   console.error(err);
    else      console.log('data: ', data);
  });
}

const S3_BUCKET= 'lightning test bucket';
var s3 = new AWS.S3(AWS_CREDENTIALS);

function _pushToS3(data) {
  var params = {Bucket: S3_BUCKET, Key: uuid.v4(), Body: data};

  s3.putObject(params, function (err, data) {
    if(err)   console.error(err);
    else      console.log('data: ', data);
  });
}

function scan(url, options) {
  options = options || {};

  phantomas(url, options, function(err, json, result) {
    var resultMetrics = result.getMetrics();
    var importantResultMetrics = IMPORTANT_METRICS.map(function(metricKey) {
      return { MetricName: metricKey, Value: resultMetrics[metricKey] };
    });

    _pushToCloudWatch(importantResultMetrics);
    _pushToS3(importantResultMetrics);
  });
}

module.exports = {
  scan: scan
};
