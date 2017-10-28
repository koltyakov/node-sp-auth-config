import * as inquirer from 'inquirer';

import { IOnpremiseFbaCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
    let onPremiseFbaCredentials: IOnpremiseFbaCredentials = (authContext.authOptions as IOnpremiseFbaCredentials);
    let promptFor: inquirer.Question[] = [
      {
        name: 'username',
        message: 'User name',
        type: 'input',
        default: onPremiseFbaCredentials.username,
        validate: (answer: string) => {
          if (answer.length === 0) {
            return false;
          }
          return true;
        }
      }, {
        name: 'password',
        message: 'Password',
        type: 'password',
        default: onPremiseFbaCredentials.password,
        validate: (answer: string) => {
          if (answer.length === 0) {
            return false;
          }
          return true;
        }
      }
    ];
    inquirer.prompt(promptFor)
      .then((answers: inquirer.Answers) => {
        answersAll = {
          ...answersAll,
          ...answers,
          ...{
            fba: true
          }
        };
        resolve(answersAll);
      });
  });
};

export default wizard;
