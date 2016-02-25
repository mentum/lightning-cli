# lightning-cli

Lightweight command line interface simplfying lightning usage.

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

_--every_: An optional argument to set interval in a friendly way. Will override --interval. Example: --every 2-hours.

_--start-date_: An optional ISO8601 formatted date specifying when the scanning starts. Will override --start-stamp Example: --start-date 2016-07-02
