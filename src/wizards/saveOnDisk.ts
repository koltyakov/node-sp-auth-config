import * as inquirer from 'inquirer';
import * as Promise from 'bluebird';

import { convertAuthContextToSettings, convertSettingsToAuthContext, saveConfigOnDisk } from '../utils';
import { IAuthContext, IAuthConfigSettings } from '../interfaces';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        if (typeof settings.saveConfigOnDisk === 'undefined') {
            let promptFor: inquirer.Question[] = [{
                name: 'save',
                message: 'Save on disk?',
                type: 'confirm'
            }];
            inquirer.prompt(promptFor)
                .then((answers: inquirer.Answers) => {
                    if (answers.save) {
                        return saveConfigOnDisk(convertSettingsToAuthContext(answersAll as IAuthContext), settings)
                            .then(() => {
                                resolve(answersAll);
                            });
                    } else {
                        resolve(answersAll);
                    }
                });
        } else {
            if (settings.saveConfigOnDisk) {
                return saveConfigOnDisk(convertSettingsToAuthContext(answersAll as IAuthContext), settings)
                    .then(() => {
                        resolve(answersAll);
                    });
            } else {
                resolve(answersAll);
            }
        }
    });
};

export default wizard;
