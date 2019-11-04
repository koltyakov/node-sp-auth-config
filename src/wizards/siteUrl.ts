import { Question, prompt } from 'inquirer';

import { shouldSkipQuestionPromptMapper } from '../utils/hooks';
import { trimByChar } from '../utils/strings';
import { IWizardCallback } from '../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
  const promptFor: Question[] = [{
    name: 'siteUrl',
    message: 'SharePoint URL',
    type: 'input',
    default: authContext.siteUrl,
    validate: (answer) => answer.length > 0
  }];

  console.log(''); // Separate wizard in CLI UI
  const answers = await prompt(
    await shouldSkipQuestionPromptMapper(promptFor, authContext, settings, answersAll)
  );
  const siteUrl: string = answers.siteUrl || authContext.siteUrl || ''; // save default
  return {
    ...answersAll,
    siteUrl: trimByChar(siteUrl, '/')
  };
};

export default wizard;
