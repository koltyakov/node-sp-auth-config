import { Question, prompt, PasswordQuestion } from 'inquirer';
import { IOnpremiseFbaCredentials } from 'node-sp-auth';

import { shouldSkipQuestionPromptMapper } from '../../utils/hooks';
import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
  const onPremiseFbaCredentials = authContext.authOptions as IOnpremiseFbaCredentials;
  const promptFor: Question[] = [
    {
      name: 'username',
      message: 'User name',
      type: 'input',
      default: onPremiseFbaCredentials.username,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'password',
      message: 'Password',
      type: 'password',
      mask: '*',
      default: onPremiseFbaCredentials.password ? defaultPasswordMask : null,
      validate: (answer) => answer.length > 0
    } as PasswordQuestion,
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
    ...answersAll, ...answers,
    password: answers.password === defaultPasswordMask
      ? onPremiseFbaCredentials.password
      : answers.password,
    fba: true
  };
};

export default wizard;
