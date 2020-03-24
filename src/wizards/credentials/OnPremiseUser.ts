import { Question, prompt, PasswordQuestion } from 'inquirer';
import { IOnpremiseUserCredentials } from 'node-sp-auth';

import { shouldSkipQuestionPromptMapper } from '../../utils/hooks';
import { defaultPasswordMask } from '../../utils';
import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
  const onPremiseUserCredentials = authContext.authOptions as IOnpremiseUserCredentials;
  let promptFor: Question[] = [
    {
      name: 'username',
      message: 'User name',
      type: 'input',
      default: onPremiseUserCredentials.username,
      validate: (answer: string) => answer.length > 0
    }
  ];
  let { username } = await prompt(promptFor);
  answersAll = {
    ...answersAll,
    username
  };
  let noDomain = false;
  if (username.indexOf('@') !== -1) {
    noDomain = true;
  }
  if (username.indexOf('\\') !== -1) {
    noDomain = true;
    username = username.replace('\\\\', '\\');
    answersAll.domain = username.split('\\')[0];
    answersAll.username = username.split('\\')[1];
  }
  promptFor = [];
  if (!noDomain) {
    promptFor.push({
      name: 'domain',
      message: 'Domain',
      type: 'input',
      default: onPremiseUserCredentials.domain,
      validate: (answer) => answer.length > 0
    });
  }
  promptFor.push({
    name: 'password',
    message: 'Password',
    type: 'password',
    mask: '*',
    default: onPremiseUserCredentials.password ? defaultPasswordMask : null,
    validate: (answer) => answer.length > 0
  } as PasswordQuestion);

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
      ? onPremiseUserCredentials.password
      : answers.password
  };
};

export default wizard;
