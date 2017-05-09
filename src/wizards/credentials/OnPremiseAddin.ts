import * as inquirer from 'inquirer';
import * as Promise from 'bluebird';

import { IOnPremiseAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let onPremiseAddinCredentials: IOnPremiseAddinCredentials = (authContext.authOptions as IOnPremiseAddinCredentials);
        let promptFor: inquirer.Question[] = [
            {
                name: 'clientId',
                message: 'clientId',
                type: 'input',
                default: onPremiseAddinCredentials.clientId
            }, {
                name: 'issuerId',
                message: 'issuerId',
                type: 'input',
                default: onPremiseAddinCredentials.issuerId
            }, {
                name: 'realm',
                message: 'realm',
                type: 'input',
                default: onPremiseAddinCredentials.realm
            }, {
                name: 'rsaPrivateKeyPath',
                message: 'rsaPrivateKeyPath',
                type: 'input',
                default: onPremiseAddinCredentials.rsaPrivateKeyPath
            }, {
                name: 'shaThumbprint',
                message: 'shaThumbprint',
                type: 'input',
                default: onPremiseAddinCredentials.shaThumbprint
            }
        ];
        inquirer.prompt(promptFor)
            .then((answers: inquirer.Answers) => {
                answersAll = {
                    ...answersAll,
                    ...answers
                };
                resolve(answersAll);
            });
    });
};

export default wizard;
