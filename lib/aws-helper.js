var AWS = require('aws-sdk');

const CLOUDWATCH_NAMESPACE = 'lightning test'; //TODO change this as configs or param
const CLOUDWATCH_METRICS_DATA_CHUNK_SIZE = 20;
const S3_BUCKET = 'lightning-test-bucket'; //TODO change this as configs or param

//TODO change this as configs or param
var AWS_CREDENTIALS = {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: 'us-east-1'
};

var cloudwatch = new AWS.CloudWatch(AWS_CREDENTIALS);
var s3 = new AWS.S3(AWS_CREDENTIALS);

function _processDataForCloudWatch(metricData) {
    var chunks = [];

    var formattedData = Object.keys(metricData)
        .filter(function (key) {
            return typeof metricData[key] == 'number';
        })
        .map(function (key) {
            return {MetricName: key, Value: metricData[key]};
        });

    while (formattedData.length > 0)
        chunks.push(formattedData.splice(0, CLOUDWATCH_METRICS_DATA_CHUNK_SIZE));

    return chunks;
}

//TODO ADD A PROMISE STYLE CALLBACK ?
function _pushToCloudWatch(cloudWatchMetricsData) {
    var cloudwatchMetric = {
        Namespace: CLOUDWATCH_NAMESPACE,
        MetricData: cloudWatchMetricsData
    };

    cloudwatch.putMetricData(cloudwatchMetric, function (err, data) {
        if (err)  console.error(err);
        else      console.log('data: ', data);
    });
}

//TODO ADD PROMISE STYLE CALLBACKS ?
//TODO move this straight in phantomas
function _pushAllToCloudWatch(metricData) {
    var cloudWatchMetricsDataChunks = _processDataForCloudWatch(metricData);

    for (var i = 0; i < cloudWatchMetricsDataChunks.length; i++) {
        _pushToCloudWatch(cloudWatchMetricsDataChunks[i]);
    }
}

//TODO ADD A PROMISE STYLE CALLBACK ?
function _pushToS3(data) {
    var timestampKey = String(Date.now());
    var params = {Bucket: S3_BUCKET, Key: timestampKey, Body: JSON.stringify(data)};

    s3.putObject(params, function (err, data) {
        if (err)  console.error(err);
        else      console.log('data: ', data);
    });
}

module.exports = {
    pushAllToCloudWatch: _pushAllToCloudWatch,
    pushToS3: _pushToS3
};
