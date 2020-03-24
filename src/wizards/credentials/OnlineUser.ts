import { Question, prompt, PasswordQuestion } from 'inquirer';
import { IUserCredentials } from 'node-sp-auth';

import { shouldSkipQuestionPromptMapper } from '../../utils/hooks';
import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
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
    ...answersAll, ...answers,
    password: answers.password === defaultPasswordMask
      ? userCredentials.password
      : answers.password,
    online: true
  };
};

export default wizard;
