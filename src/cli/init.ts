import * as colors from 'colors';
import * as path from 'path';
import { AuthConfig } from '../index';

import { ICliInitParameters } from '../interfaces';

export const init = (options: ICliInitParameters): Promise<void> => {

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
    saveConfigOnDisk: true,
    forcePrompts: true,
    masterKey: options.masterkey
  });

  return authConfig.getContext()
    .then(() => {
      console.log(`\n${colors.green('File saved to')} ${colors.cyan(path.resolve(options.path))}`);
    })
    .catch((error) => {
      console.log('Error:', error);
    });

};
