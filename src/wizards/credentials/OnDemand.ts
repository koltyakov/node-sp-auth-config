import * as inquirer from 'inquirer';

import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (_authContext: IAuthContext, answersAll: inquirer.Answers = {}, _settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  const promptFor: inquirer.Question[] = [];
  return inquirer.prompt(promptFor).then(_answers => {
    return {
      ...answersAll,
      ...{
        ondemand: true
      }
    };
  });
};

export default wizard;
