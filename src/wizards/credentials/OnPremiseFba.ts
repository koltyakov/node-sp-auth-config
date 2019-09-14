import { Question, prompt, PasswordQuestion } from 'inquirer';
import { IOnpremiseFbaCredentials } from 'node-sp-auth';

import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
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
  const answers = await prompt(promptFor);
  return {
    ...answersAll, ...answers,
    password: answers.password === defaultPasswordMask
      ? onPremiseFbaCredentials.password
      : answers.password,
    fba: true
  };
};

export default wizard;
