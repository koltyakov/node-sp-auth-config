import { Question, prompt } from 'inquirer';
import { IOnPremiseAddinCredentials } from 'node-sp-auth';

import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
  const onPremiseAddinCredentials = authContext.authOptions as IOnPremiseAddinCredentials;
  const promptFor: Question[] = [
    {
      name: 'clientId',
      message: 'clientId',
      type: 'input',
      default: onPremiseAddinCredentials.clientId,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'issuerId',
      message: 'issuerId',
      type: 'input',
      default: onPremiseAddinCredentials.issuerId,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'realm',
      message: 'realm',
      type: 'input',
      default: onPremiseAddinCredentials.realm,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'rsaPrivateKeyPath',
      message: 'rsaPrivateKeyPath',
      type: 'input',
      default: onPremiseAddinCredentials.rsaPrivateKeyPath,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'shaThumbprint',
      message: 'shaThumbprint',
      type: 'input',
      default: onPremiseAddinCredentials.shaThumbprint,
      validate: (answer) => answer.length > 0
    }
  ];
  const answers = await prompt(promptFor);
  return { ...answersAll, ...answers };
};

export default wizard;
