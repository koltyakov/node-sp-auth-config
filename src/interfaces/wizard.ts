import * as inquirer from 'inquirer';
import { IAuthContext, IAuthConfigSettings } from './';

export type IWizardCallback = (
  authContext: IAuthContext,
  settings: IAuthConfigSettings,
  answersAll: inquirer.Answers
) => Promise<inquirer.Answers>;

export interface IHooks {
  // Ad-hoc logic for a skipping specific prompt
  shouldSkipQuestionPrompt?: (promptContext: {
    authContext: IAuthContext;
    answersAll: inquirer.Answers;
    question: inquirer.Question;
  }) => Promise<boolean> | boolean;
}
