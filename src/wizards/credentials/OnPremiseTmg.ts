import * as inquirer from 'inquirer';

import { IOnpremiseTmgCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';
import { defaultPasswordMask } from '../../utils';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, _settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  const onPremiseTmgCredentials: IOnpremiseTmgCredentials = (authContext.authOptions as IOnpremiseTmgCredentials);
  const promptFor: inquirer.Question[] = [
    {
      name: 'username',
      message: 'User name',
      type: 'input',
      default: onPremiseTmgCredentials.username,
      validate: (answer: string) => {
        if (answer.length === 0) {
          return false;
        }
        return true;
      }
    }, {
      name: 'password',
      message: 'Password',
      type: 'password',
      default: onPremiseTmgCredentials.password ? defaultPasswordMask : null,
      validate: (answer: string) => {
        if (answer.length === 0) {
          return false;
        }
        return true;
      }
    }
  ];
  return inquirer.prompt(promptFor).then(answers => {
    return {
      ...answersAll,
      ...answers,
      password: answers.password === defaultPasswordMask
        ? onPremiseTmgCredentials.password
        : answers.password,
      ...{
        tmg: true
      }
    };
  });
};

export default wizard;
