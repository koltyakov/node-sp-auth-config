import { Question, prompt } from 'inquirer';
import { IUserCredentials } from 'node-sp-auth';

import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
  const userCredentials = authContext.authOptions as IUserCredentials;
  const promptFor: Question[] = [
    {
      name: 'username',
      message: 'User name',
      type: 'input',
      default: userCredentials.username,
      validate: (answer) => {
        if (answer.indexOf('@') === -1) {
          return 'Wrong username pattern, should be: username@contoso.onmicrosoft.com';
        }
        return answer.length > 0;
      }
    },
    {
      name: 'password',
      message: 'Password',
      type: 'password',
      mask: '*',
      default: userCredentials.password ? defaultPasswordMask : null,
      validate: (answer) => answer.length > 0
    }
  ];
  const answers = await prompt(promptFor);
  return {
    ...answersAll, ...answers,
    password: answers.password === defaultPasswordMask
      ? userCredentials.password
      : answers.password,
    online: true
  };
};

export default wizard;
