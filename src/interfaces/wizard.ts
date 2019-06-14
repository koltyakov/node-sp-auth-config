import * as inquirer from 'inquirer';
import { IAuthContext, IAuthConfigSettings } from './';

export type IWizardCallback = (
  authContext: IAuthContext,
  answersAll?: inquirer.Answers,
  settings?: IAuthConfigSettings
) => Promise<inquirer.Answers>;
