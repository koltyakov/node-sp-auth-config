import * as inquirer from 'inquirer';

import { IOnDemandCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  let onlineAddinCredentials: IOnDemandCredentials = (authContext.authOptions as IOnDemandCredentials);
  let promptFor: inquirer.Question[] = [];
  return inquirer.prompt(promptFor)
    .then((answers: inquirer.Answers) => {
      return {
        ...answersAll,
        ...{
          ondemand: true
        }
      };
    });
};

export default wizard;
