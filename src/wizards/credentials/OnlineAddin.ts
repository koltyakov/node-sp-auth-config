import * as inquirer from 'inquirer';
import * as Promise from 'bluebird';

import { IOnlineAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let onlineAddinCredentials: IOnlineAddinCredentials = (authContext.authOptions as IOnlineAddinCredentials);
        let promptFor: inquirer.Question[] = [
            {
                name: 'clientId',
                message: 'clientId',
                type: 'input',
                default: onlineAddinCredentials.clientId,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
            }, {
                name: 'clientSecret',
                message: 'clientSecret',
                type: 'input',
                default: onlineAddinCredentials.clientSecret,
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
                return resolve(answersAll);
            });
    });
};

export default wizard;
