import { Question, prompt, PasswordQuestion } from 'inquirer';
import { IOnlineAddinCredentials } from 'node-sp-auth';

import { shouldSkipQuestionPromptMapper } from '../../utils/hooks';
import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
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
    } as PasswordQuestion
  ];

  // Save defaults
  answersAll = {
    ...answersAll,
    ...promptFor.reduce((r: any, q) => {
      if (typeof q.default !== 'undefined') {
        r[q.name] = q.default;
      }
      return r;
    }, {})
  };

  const answers = await prompt(
    await shouldSkipQuestionPromptMapper(promptFor, authContext, settings, answersAll)
  );
  return {
    ...answersAll,
    ...answers,
    clientSecret: answers.clientSecret === defaultPasswordMask
      ? onlineAddinCredentials.clientSecret
      : answers.clientSecret
  };
};

export default wizard;
