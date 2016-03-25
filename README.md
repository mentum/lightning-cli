# lightning-cli

[![wercker status](https://app.wercker.com/status/cfca42b5bd800ff7eb8fb06e2b152b40/s/master "wercker status")](https://app.wercker.com/project/bykey/cfca42b5bd800ff7eb8fb06e2b152b40)

Lightweight command line interface simplfying lightning usage


## Installation

```
npm install -g lightning-cli
```

## Usage

#### Immediate scan
```
lightning scan <url>
```

_url_: valid url of the website you want to be analyzed.

_--verbose_: A flag used to output result metrics

#### Schedule a recurring scan
```
lightning schedule <url> --interval --start
```
_url_: valid url of the website you want to be analyzed.

_--interval_: A time interval in milliseconds. Defaults to one day. Minimum value 5 minutes (300000)

_--start-stamp_: A milliseconds timestamp specifying when the scanning starts. Defaults to now + interval

_--every_: An optional argument to set interval in a friendly way. Will override --interval. Example: --every 2-hours. For more examples, refer to the [moment.js duration doc](http://momentjs.com/docs/#/durations/). Make sur to link number and unit by a - .

_--start-date_: An optional ISO8601 formatted date specifying when the scanning starts. Will override --start-stamp Example: --start-date 2016-07-02
