#!/usr/bin/env node

'use strict';

let cli;
cli = require('./lib');

if (cli) {
  cli.run();
} else {
  console.error('Are you at home directory of a react-native project?');
  console.error('`pushy install` is under development, please run `npm install react-native-update` to install pushy manually.');
  process.exit(1);
}