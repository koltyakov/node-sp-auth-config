import * as inquirer from 'inquirer';

import { IOnPremiseAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, _settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  const onPremiseAddinCredentials: IOnPremiseAddinCredentials = (authContext.authOptions as IOnPremiseAddinCredentials);
  const promptFor: inquirer.Question[] = [
    {
      name: 'clientId',
      message: 'clientId',
      type: 'input',
      default: onPremiseAddinCredentials.clientId,
      validate: (answer: string) => answer.length > 0
    }, {
      name: 'issuerId',
      message: 'issuerId',
      type: 'input',
      default: onPremiseAddinCredentials.issuerId,
      validate: (answer: string) => answer.length > 0
    }, {
      name: 'realm',
      message: 'realm',
      type: 'input',
      default: onPremiseAddinCredentials.realm,
      validate: (answer: string) => answer.length > 0
    }, {
      name: 'rsaPrivateKeyPath',
      message: 'rsaPrivateKeyPath',
      type: 'input',
      default: onPremiseAddinCredentials.rsaPrivateKeyPath,
      validate: (answer: string) => answer.length > 0
    }, {
      name: 'shaThumbprint',
      message: 'shaThumbprint',
      type: 'input',
      default: onPremiseAddinCredentials.shaThumbprint,
      validate: (answer: string) => answer.length > 0
    }
  ];
  return inquirer.prompt(promptFor).then(answers => {
    return {
      ...answersAll,
      ...answers
    };
  });
};

export default wizard;
