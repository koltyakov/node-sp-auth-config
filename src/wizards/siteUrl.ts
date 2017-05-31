import * as inquirer from 'inquirer';

import { IOnPremiseAddinCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let promptFor: inquirer.Question[] = [];

        // Require SharePoint URL
        promptFor = [{
            name: 'siteUrl',
            message: 'SharePoint URL',
            type: 'string',
            default: authContext.siteUrl,
            validate: (answer: string) => {
                if (answer.length === 0) {
                    return false;
                }
                return true;
            }
        }];
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
