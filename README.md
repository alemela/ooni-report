# OONI Report
Code tested and run on Node.js v0.10 and above.

## Description
These scripts allow users to generate monthly reports aggregated by country based on data produced by [OONI project](https://ooni.torproject.org/).

## Features
Scripts below are able to extract, aggregate, and generate reports from compressed YAML files.

### tests.js
`node tests.js [directory]` extracts compressed YAML files from a directory and it aggregates and serializes data as JSON to generate reports. An example of a JSON file is available here: [https://github.com/alemela/ooni-report/tree/master/output/VN_2013_5.json](https://github.com/alemela/ooni-report/tree/master/output/VN_2013_5.json).

### reportGenerator.js
`node reportGenerator.js [country_code] [year] [month]` generates a report in Markdown. An example of a report is available here: [https://github.com/alemela/ooni-report/tree/master/reports/VN_2013_5.md](https://github.com/alemela/ooni-report/tree/master/reports/VN_2013_5.md).

