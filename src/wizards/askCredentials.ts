import * as inquirer from 'inquirer';

import { IAuthContext, IAuthConfigSettings } from '../interfaces';

// Strategies wizards >>>
import onPremiseAddinWizard from './credentials/OnPremiseAddin';
import onPremiseUserWizard from './credentials/OnPremiseUser';
import onPremiseTmgWizard from './credentials/OnPremiseTmg';
import onPremiseFbaWizard from './credentials/OnPremiseFba';
import onlineAddinWizard from './credentials/OnlineAddin';
import onlineUserWizard from './credentials/OnlineUser';
import adfsUserWizard from './credentials/AdfsUser';
import onDemandWizard from './credentials/OnDemand';
// <<< Strategies wizards

const wizard = (
  authContext: IAuthContext,
  answersAll: inquirer.Answers = {},
  settings: IAuthConfigSettings = {}
): Promise<inquirer.Answers> => {
  let promptFor: inquirer.Question[] = [];
  let answers: Promise<inquirer.Answers>;
  // Ask for strategy specific parameters
  promptFor = [];
  switch (answersAll.strategy) {
    case 'OnPremiseAddinCredentials':
      answers = onPremiseAddinWizard(authContext, answersAll);
      break;
    case 'OnpremiseUserCredentials':
      answers = onPremiseUserWizard(authContext, answersAll);
      break;
    case 'OnpremiseTmgCredentials':
      answers = onPremiseTmgWizard(authContext, answersAll);
      break;
    case 'OnpremiseFbaCredentials':
      answers = onPremiseFbaWizard(authContext, answersAll);
      break;
    case 'OnlineAddinCredentials':
      answers = onlineAddinWizard(authContext, answersAll);
      break;
    case 'UserCredentials':
      answers = onlineUserWizard(authContext, answersAll);
      break;
    case 'AdfsUserCredentials':
      answers = adfsUserWizard(authContext, answersAll);
      break;
    case 'OnDemandCredentials':
      answers = onDemandWizard(authContext, answersAll);
      break;
    default:
      answers = new Promise(r => r(answersAll));
      break;
  }
  return answers;
};

export default wizard;
