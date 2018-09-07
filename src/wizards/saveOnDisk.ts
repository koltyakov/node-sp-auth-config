import * as inquirer from 'inquirer';

import { convertAuthContextToSettings, convertSettingsToAuthContext, saveConfigOnDisk } from '../utils';
import { IAuthContext, IAuthConfigSettings } from '../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  if (typeof settings.saveConfigOnDisk === 'undefined') {
    const promptFor: inquirer.Question[] = [{
      name: 'save',
      message: 'Save on disk?',
      type: 'confirm'
    }];
    return inquirer.prompt(promptFor)
      .then((answers: inquirer.Answers) => {
        if (answers.save) {
          return saveConfigOnDisk(convertSettingsToAuthContext(answersAll as IAuthContext), settings)
            .then(() => {
              return answersAll;
            });
        } else {
          return answersAll;
        }
      });
  } else if (settings.saveConfigOnDisk) {
    return saveConfigOnDisk(convertSettingsToAuthContext(answersAll as IAuthContext), settings)
      .then(() => {
        return answersAll;
      });
  } else {
    return new Promise(r => r(answersAll));
  }
};

export default wizard;
