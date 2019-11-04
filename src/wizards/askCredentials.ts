import * as inquirer from 'inquirer';

import { IWizardCallback } from '../interfaces/wizard';

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

const wizard: IWizardCallback = async (authContext, settings, answersAll = {}) => {
  const strategyWizard: IWizardCallback = {
    OnPremiseAddinCredentials: onPremiseAddinWizard,
    OnpremiseUserCredentials: onPremiseUserWizard,
    OnpremiseTmgCredentials: onPremiseTmgWizard,
    OnpremiseFbaCredentials: onPremiseFbaWizard,
    OnlineAddinCredentials: onlineAddinWizard,
    UserCredentials: onlineUserWizard,
    AdfsUserCredentials: adfsUserWizard,
    OnDemandCredentials: onDemandWizard
  }[answersAll.strategy];

  if (strategyWizard) {
    return strategyWizard(authContext, settings, answersAll);
  }

  return answersAll;
};

export default wizard;
