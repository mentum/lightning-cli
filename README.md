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

#### Schedule a recurring scan
```
lightning schedule <url> --interval --start
```
_url_: valid url of the website you want to be analyzed.
_--interval_: A time interval in milliseconds. Defaults to one day. Minimum value 5 minutes (300000)
_--start_: A milliseconds timestamp specifying when the scanning starts. Defaults to now + interval
