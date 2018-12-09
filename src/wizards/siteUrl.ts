import * as inquirer from 'inquirer';

import { IAuthContext, IAuthConfigSettings } from '../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, _settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  let promptFor: inquirer.Question[] = [];

  // Require SharePoint URL
  promptFor = [{
    name: 'siteUrl',
    message: 'SharePoint URL',
    type: 'string',
    default: authContext.siteUrl,
    validate: (answer: string) => {
      if (answer.length === 0) {
        return false;
      }
      return true;
    }
  }];

  console.log('');
  return inquirer.prompt(promptFor).then(answers => {
    return {
      ...answersAll,
      ...answers
    };
  });
};

export default wizard;
