/*
 // Note:: this file is only a phantomas proxy and will soon be replaced by something crazy
 */
var phantomas = require('phantomas'),
    aws_helper = require('./aws-helper');

function scan(url, options) {
    options = options || {};

    phantomas(url, options, function (err, json, result) {
        var resultMetrics = result.getMetrics();

        aws_helper.pushAllToCloudWatch(resultMetrics);
        aws_helper.pushToS3(resultMetrics);
    });
}

module.exports = {
    scan: scan
};
