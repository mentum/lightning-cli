var phantomas = require('phantomas');

function scan(url, options) {
  options = options || {};

  phantomas(url, options, function(err, json, results) {
    if(err) console.error(err);
    else    console.log(json);
  });
}

module.exports = {
  scan: scan
};
