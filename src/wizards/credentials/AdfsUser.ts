import * as inquirer from 'inquirer';
import * as Promise from 'bluebird';

import { IAdfsUserCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let adfsUserCredentials: IAdfsUserCredentials = (authContext.authOptions as IAdfsUserCredentials);
        let promptFor: inquirer.Question[] = [
            {
                name: 'username',
                message: 'User name',
                type: 'input',
                default: adfsUserCredentials.username
            }, {
                name: 'password',
                message: 'Password',
                type: 'password',
                default: adfsUserCredentials.password
            }, {
                name: 'relyingParty',
                message: 'relyingParty',
                type: 'input',
                default: adfsUserCredentials.relyingParty || 'urn:sharepoint:portal'
            }, {
                name: 'adfsUrl',
                message: 'adfsUrl',
                type: 'input',
                default: adfsUserCredentials.adfsUrl
            }, {
                name: 'adfsCookie',
                message: 'adfsCookie',
                type: 'input',
                default: adfsUserCredentials.adfsCookie || 'FedAuth'
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
