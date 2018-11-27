import * as inquirer from 'inquirer';

import { IOnDemandCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  const onlineAddinCredentials: IOnDemandCredentials = (authContext.authOptions as IOnDemandCredentials);
  const promptFor: inquirer.Question[] = [];
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
