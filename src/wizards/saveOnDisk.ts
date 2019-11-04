import { Question, prompt } from 'inquirer';

import { shouldSkipQuestionPromptMapper } from '../utils/hooks';
import { convertSettingsToAuthContext, saveConfigOnDisk } from '../utils';

import { IAuthContext } from '../interfaces';
import { IWizardCallback } from '../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
  let saveOnDisk = settings.saveConfigOnDisk;
  if (typeof settings.saveConfigOnDisk === 'undefined') {
    const promptFor: Question[] = [{
      name: 'save',
      message: 'Save on disk?',
      type: 'confirm'
    }];
    const answers = await prompt(
      await shouldSkipQuestionPromptMapper(promptFor, authContext, settings, answersAll)
    );
    saveOnDisk = answers.save;
  }

  if (saveOnDisk) {
    const authCtx = convertSettingsToAuthContext(answersAll as IAuthContext);
    await saveConfigOnDisk(authCtx, settings);
  }

  return answersAll;
};

export default wizard;
