import { Question, prompt } from 'inquirer';
import { IOnlineAddinCredentials } from 'node-sp-auth';

import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
  const onlineAddinCredentials = authContext.authOptions as IOnlineAddinCredentials;
  const promptFor: Question[] = [
    {
      name: 'clientId',
      message: 'clientId',
      type: 'input',
      default: onlineAddinCredentials.clientId,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'clientSecret',
      message: 'clientSecret',
      type: 'password',
      mask: '*',
      default: onlineAddinCredentials.clientSecret ? defaultPasswordMask : null,
      validate: (answer) => answer.length > 0
    }
  ];
  const answers = await prompt(promptFor);
  return {
    ...answersAll, ...answers,
    clientSecret: answers.clientSecret === defaultPasswordMask
      ? onlineAddinCredentials.clientSecret
      : answers.clientSecret
    // online: true
  };
};

export default wizard;
