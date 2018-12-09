import * as inquirer from 'inquirer';

import { convertSettingsToAuthContext, saveConfigOnDisk } from '../utils';
import { IAuthContext, IAuthConfigSettings } from '../interfaces';

const wizard = (_authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  if (typeof settings.saveConfigOnDisk === 'undefined') {
    const promptFor: inquirer.Question[] = [{
      name: 'save',
      message: 'Save on disk?',
      type: 'confirm'
    }];
    return inquirer.prompt(promptFor).then(answers => {
      if (answers.save) {
        return saveConfigOnDisk(convertSettingsToAuthContext(answersAll as IAuthContext), settings).then(() => answersAll);
      } else {
        return answersAll;
      }
    });
  } else if (settings.saveConfigOnDisk) {
    return saveConfigOnDisk(convertSettingsToAuthContext(answersAll as IAuthContext), settings).then(() => answersAll);
  } else {
    return Promise.resolve(answersAll);
  }
};

export default wizard;
