import * as inquirer from 'inquirer';

import { IOnPremiseAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
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
  return inquirer.prompt(promptFor)
    .then((answers: inquirer.Answers) => {
      return {
        ...answersAll,
        ...answers
      };
    });
};

export default wizard;
