import * as path from 'path';
import { AuthConfig } from '../src/index';

const authConfig = new AuthConfig({
  configPath: path.join(__dirname, '../config/private.json'),
  forcePrompts: true,
  authOptions: {
    siteUrl: 'https://contoso.sharepoint.com/sites/site',
    strategy: 'UserCredentials', // 'OnlineAddinCredentials'
    username: 'service.account_contoso.onmicrosoft.com' // incorrect password to appear in prompts
  } as any,
  hooks: {
    shouldSkipQuestionPrompt: (promptCtx): boolean => {
      // Will skip asking siteUrl of provided
      if (promptCtx.question.name === 'siteUrl' && promptCtx.question.default) {
        return true;
      }
      // Will skip prompt for the strategy when the dafults is UserCredentials
      if (promptCtx.question.name === 'strategy') {
        const defaultStrategyName = (promptCtx.question as any).choices[promptCtx.question.default].value;
        if (defaultStrategyName === 'UserCredentials') {
          return true;
        }
      }
      // Will skip username prompt if it's valid
      if (
        promptCtx.question.name === 'username' &&
        promptCtx.question.default &&
        promptCtx.question.validate(promptCtx.question.default) === true
      ) {
        return true;
      }
      return false; // do not skip anything else
    }
  }
});

authConfig.getContext()
  .then((context) => console.log(JSON.stringify(context, null, 2)))
  .catch(console.warn);
