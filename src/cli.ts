#!/usr/bin/env node

import * as program from 'commander';
import * as path from 'path';

import { init as initAction } from './cli/init';
import { read as readAction } from './cli/read';

const { version } = require(path.join(__dirname, '..', 'package.json'));

program
  .version(version)
  .name('sp-auth')
  .usage('[command]')
  .description('Command line config options builder for node-sp-auth (SharePoint Authentication in Node.js)');

program
  .command('init')
  .description('writes new file with node-sp-auth credentials into the file system')
  .option('-p, --path [value]', 'relative path to file which will store your credentials, required')
  .option('-e, --encrypt [true, false]', 'specify false if you don\'t need to encrypt password in the file, optional, default is true', true)
  .option('-k, --masterkey [value]', 'optional key used to encrypt and decrypt your sensitive data (passwords), by default unique machine id is used', null)
  .action(initAction);

program
  .command('read')
  .description('reads credentials from a private.json file')
  .option('-p, --path [value]', 'relative path to file which will store your credentials, required')
  .option('-e, --encrypt [true, false]', 'specify false if you don\'t need to encrypt password in the file, optional, default is true', true)
  .option('-k, --masterkey [value]', 'optional key used to encrypt and decrypt your sensitive data (passwords), by default unique machine id is used', null)
  .option('-f, --format', 'optional key used configure formatted output')
  .action(readAction);

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
