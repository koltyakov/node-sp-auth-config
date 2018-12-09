import * as colors from 'colors';
import * as path from 'path';
import { AuthConfig } from '../index';

import { ICliReadParameters } from '../interfaces';

export const read = (options: ICliReadParameters): Promise<void> => {

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
    saveConfigOnDisk: false,
    forcePrompts: false,
    headlessMode: true,
    masterKey: options.masterkey
  });

  return authConfig.getContext()
    .then(context => {
      const contextString = options.format ? JSON.stringify(context, null, 2) : JSON.stringify(context);
      console.log(contextString);
    })
    .catch(error => {
      console.log('Error:', error);
    });

};
