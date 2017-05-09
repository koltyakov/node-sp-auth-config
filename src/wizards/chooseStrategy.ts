import * as inquirer from 'inquirer';
import * as Promise from 'bluebird';

import { IAuthContext, IAuthConfigSettings, IStrategyDictItem } from '../interfaces';
import { getStrategies } from '../config';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
    return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
        let promptFor: inquirer.Question[] = [];

        // SharePoint Online/OnPremise autodetection
        let target: ('Online' | 'OnPremise') = answersAll.siteUrl.toLowerCase().indexOf('.sharepoint.com') !== -1 ? 'Online' : 'OnPremise';
        let strategies: IStrategyDictItem[] = getStrategies().filter((strategy: IStrategyDictItem) => {
            return strategy.target.indexOf(target) !== -1;
        });

        promptFor = [{
            name: 'strategy',
            message: 'Authentication strategy',
            type: 'list',
            choices: strategies.map((strategy: IStrategyDictItem) => {
                let checked: boolean = false;
                if (authContext.strategy === strategy.id) {
                    checked = true;
                }
                return {
                    name: strategy.name,
                    value: strategy.id,
                    short: strategy.name,
                    checked
                };
            })
        }];
        // tslint:disable-next-line:no-shadowed-variable
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
