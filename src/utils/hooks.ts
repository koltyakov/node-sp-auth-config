import { Question, Answers } from 'inquirer';
import { IAuthContext, IAuthConfigSettings } from '../interfaces';

// Wraps wizard questions prompts array into ad-hoc logic a for skipping specific prompt
export const shouldSkipQuestionPromptMapper = async <T = Question>(
  questions: T[],
  authContext: IAuthContext,
  settings: IAuthConfigSettings,
  answersAll: Answers
): Promise<T[]> => {
  if (
    settings.hooks &&
    settings.hooks.shouldSkipQuestionPrompt &&
    typeof settings.hooks.shouldSkipQuestionPrompt === 'function'
  ) {
    for (const question of questions) {
      try {
        const skip = await settings.hooks.shouldSkipQuestionPrompt({ question, authContext, answersAll });
        (question as Question).when = !skip;
      } catch (ex) { /**/ }
    }
  }
  return questions;
};
