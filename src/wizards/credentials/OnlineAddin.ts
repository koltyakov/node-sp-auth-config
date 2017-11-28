import * as inquirer from 'inquirer';

import { IOnlineAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  let onlineAddinCredentials: IOnlineAddinCredentials = (authContext.authOptions as IOnlineAddinCredentials);
  let promptFor: inquirer.Question[] = [
    {
      name: 'clientId',
      message: 'clientId',
      type: 'input',
      default: onlineAddinCredentials.clientId,
      validate: (answer: string) => {
        if (answer.length === 0) {
          return false;
        }
        return true;
      }
    }, {
      name: 'clientSecret',
      message: 'clientSecret',
      type: 'input',
      default: onlineAddinCredentials.clientSecret,
      validate: (answer: string) => {
        if (answer.length === 0) {
          return false;
        }
        return true;
      }
    }
  ];
  return inquirer.prompt(promptFor)
    .then((answers: inquirer.Answers) => {
      return {
        ...answersAll,
        ...answers
      };
    });
};

export default wizard;
