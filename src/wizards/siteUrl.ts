import { Question, prompt } from 'inquirer';

import { trimByChar } from '../utils/strings';
import { IWizardCallback } from '../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
  const promptFor: Question[] = [{
    name: 'siteUrl',
    message: 'SharePoint URL',
    type: 'input',
    default: authContext.siteUrl,
    validate: (answer) => answer.length > 0
  }];

  console.log(''); // Separate wizard in CLI UI
  const answers = await prompt(promptFor);
  const siteUrl: string = answers.siteUrl;
  return {
    ...answersAll,
    siteUrl: trimByChar(siteUrl, '/')
  };
};

export default wizard;
