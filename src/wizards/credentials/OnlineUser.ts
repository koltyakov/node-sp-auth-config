import * as inquirer from 'inquirer';

import { IUserCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let userCredentials: IUserCredentials = (authContext.authOptions as IUserCredentials);
        let promptFor: inquirer.Question[] = [
            {
                name: 'username',
                message: 'User name',
                type: 'input',
                default: userCredentials.username,
                validate: (answer: string) => {
                    if (answer.length === 0) {
                        return false;
                    }
                    return true;
                }
            }, {
                name: 'password',
                message: 'Password',
                type: 'password',
                default: userCredentials.password,
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
