import * as inquirer from 'inquirer';

import { IOnlineAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';
import { defaultPasswordMask } from '../../utils';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, _settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  const onlineAddinCredentials: IOnlineAddinCredentials = (authContext.authOptions as IOnlineAddinCredentials);
  const promptFor: inquirer.Question[] = [
    {
      name: 'clientId',
      message: 'clientId',
      type: 'input',
      default: onlineAddinCredentials.clientId,
      validate: (answer: string) => answer.length > 0
    }, {
      name: 'clientSecret',
      message: 'clientSecret',
      type: 'password',
      default: onlineAddinCredentials.clientSecret ? defaultPasswordMask : null,
      validate: (answer: string) => answer.length > 0
    }
  ];
  return inquirer.prompt(promptFor).then(answers => {
    return {
      ...answersAll,
      ...answers,
      clientSecret: answers.clientSecret === defaultPasswordMask
        ? onlineAddinCredentials.clientSecret
        : answers.clientSecret
    };
  });
};

export default wizard;
