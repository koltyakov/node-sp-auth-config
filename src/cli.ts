#!/usr/bin/env node

import * as program from 'commander';
import * as colors from 'colors';
import * as path from 'path';

import { ICliParameters } from './interfaces';
import { AuthConfig } from '.';

program
  .version('1.0.0')
  .name('sp-auth')
  .usage('[command]')
  .description('Command line config options builder for node-sp-auth (SharePoint Authentication in Node.js)')
  .command('init')
  .description('writes new file with node-sp-auth credentials into the file system')
  .option('-p, --path [value]', 'relative path to file which will store your credentials, required')
  .option('-e, --encrypt [true,false]', 'specify false if you don\'t need to encrypt password in the file, optional, default is true', true)
  .action((options: ICliParameters) => {
    if (typeof options.path === 'undefined') {
      console.log(
        colors.red(`'${colors.bold('-p, --path')}' parameter should be provided`),
        colors.gray(`(relative path to file which will store your credentials)`)
      );
      process.exit();
    }

    const extension = path.extname(options.path);

    if (extension !== '.json') {
      console.log(colors.red(`'${colors.bold('--path')}' file extension should to be .json`));
      process.exit();
    }

    const authConfig = new AuthConfig({
      configPath: options.path,
      encryptPassword: options.encrypt,
      saveConfigOnDisk: true
    });

    authConfig.getContext()
    .then(() => {
      console.log(colors.green('File saved'));
    });
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
