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
                default: onPremiseAddinCredentials.clientId,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
            }, {
                name: 'issuerId',
                message: 'issuerId',
                type: 'input',
                default: onPremiseAddinCredentials.issuerId,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
            }, {
                name: 'realm',
                message: 'realm',
                type: 'input',
                default: onPremiseAddinCredentials.realm,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
            }, {
                name: 'rsaPrivateKeyPath',
                message: 'rsaPrivateKeyPath',
                type: 'input',
                default: onPremiseAddinCredentials.rsaPrivateKeyPath,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
            }, {
                name: 'shaThumbprint',
                message: 'shaThumbprint',
                type: 'input',
                default: onPremiseAddinCredentials.shaThumbprint,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
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
