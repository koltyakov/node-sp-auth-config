import * as inquirer from 'inquirer';

import { IAdfsUserCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
    let adfsUserCredentials: IAdfsUserCredentials = (authContext.authOptions as IAdfsUserCredentials);
    let promptFor: inquirer.Question[] = [
      {
        name: 'username',
        message: 'User name',
        type: 'input',
        default: adfsUserCredentials.username,
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
        default: adfsUserCredentials.password,
        validate: (answer: string) => {
          if (answer.length === 0) {
            return false;
          }
          return true;
        }
      }, {
        name: 'relyingParty',
        message: 'relyingParty',
        type: 'input',
        default: adfsUserCredentials.relyingParty || 'urn:sharepoint:portal',
        validate: (answer: string) => {
          if (answer.length === 0) {
            return false;
          }
          return true;
        }
      }, {
        name: 'adfsUrl',
        message: 'adfsUrl',
        type: 'input',
        default: adfsUserCredentials.adfsUrl,
        validate: (answer: string) => {
          if (answer.length === 0) {
            return false;
          }
          return true;
        }
      }, {
        name: 'adfsCookie',
        message: 'adfsCookie',
        type: 'input',
        default: adfsUserCredentials.adfsCookie || 'FedAuth',
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
          ...answers
        };
        resolve(answersAll);
      });
  });
};

export default wizard;
