import * as inquirer from 'inquirer';

import { IOnDemandCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
    let onlineAddinCredentials: IOnDemandCredentials = (authContext.authOptions as IOnDemandCredentials);
    let promptFor: inquirer.Question[] = [];
    inquirer.prompt(promptFor)
      .then((answers: inquirer.Answers) => {
        answersAll = {
          ...answersAll,
          ...{
            ondemand: true
          }
        };
        return resolve(answersAll);
      });
  });
};

export default wizard;
