import * as inquirer from 'inquirer';

import { IAuthContext, IAuthConfigSettings } from '../interfaces';

// Strategies wizards >>>
import onPremiseAddinWizard from './credentials/OnPremiseAddin';
import onPremiseUserWizard from './credentials/OnPremiseUser';
import onPremiseFbaWizard from './credentials/OnPremiseFba';
import onlineAddinWizard from './credentials/OnlineAddin';
import onlineUserWizard from './credentials/OnlineUser';
import adfsUserWizard from './credentials/AdfsUser';
import onDemandWizard from './credentials/OnDemand';
// <<< Strategies wizards

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let promptFor: inquirer.Question[] = [];

        // Ask for strategy specific parameters
        promptFor = [];
        switch (answersAll.strategy) {
            case 'OnPremiseAddinCredentials':
                resolve(onPremiseAddinWizard(authContext, answersAll));
                break;
            case 'OnpremiseUserCredentials':
                resolve(onPremiseUserWizard(authContext, answersAll));
                break;
            case 'OnpremiseFbaCredentials':
                resolve(onPremiseFbaWizard(authContext, answersAll));
                break;
            case 'OnlineAddinCredentials':
                resolve(onlineAddinWizard(authContext, answersAll));
                break;
            case 'UserCredentials':
                resolve(onlineUserWizard(authContext, answersAll));
                break;
            case 'AdfsUserCredentials':
                resolve(adfsUserWizard(authContext, answersAll));
                break;
            case 'OnDemandCredentials':
                resolve(onDemandWizard(authContext, answersAll));
                break;
            default:
                resolve(answersAll);
                break;
        }
    });
};

export default wizard;
