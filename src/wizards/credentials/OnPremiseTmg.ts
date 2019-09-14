import { Question, prompt, PasswordQuestion } from 'inquirer';
import { IOnpremiseTmgCredentials } from 'node-sp-auth';

import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
  const onPremiseTmgCredentials = authContext.authOptions as IOnpremiseTmgCredentials;
  const promptFor: Question[] = [
    {
      name: 'username',
      message: 'User name',
      type: 'input',
      default: onPremiseTmgCredentials.username,
      validate: (answer) => answer.length > 0
    },
    {
      name: 'password',
      message: 'Password',
      type: 'password',
      mask: '*',
      default: onPremiseTmgCredentials.password ? defaultPasswordMask : null,
      validate: (answer) => answer.length > 0
    } as PasswordQuestion,
  ];
  const answers = await prompt(promptFor);
  return {
    ...answersAll, ...answers,
    password: answers.password === defaultPasswordMask
      ? onPremiseTmgCredentials.password
      : answers.password,
    tmg: true
  };
};

export default wizard;
