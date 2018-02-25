import * as inquirer from 'inquirer';

import { IAuthContext, IAuthConfigSettings, IStrategyDictItem } from '../interfaces';
import { getStrategies } from '../config';
import { isOnPrem } from '../utils';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  let promptFor: inquirer.Question[] = [];

  // SharePoint Online/OnPremise autodetection
  let target: ('Online' | 'OnPremise') = isOnPrem(answersAll.siteUrl) ? 'OnPremise' : 'Online';
  let strategies: IStrategyDictItem[] = getStrategies().filter((strategy: IStrategyDictItem) => {
    return strategy.target.indexOf(target) !== -1;
  });

  promptFor = [{
    name: 'strategy',
    message: 'Authentication strategy',
    type: 'list',
    choices: strategies.map((strategy: IStrategyDictItem) => {
      return {
        name: strategy.name,
        value: strategy.id,
        short: strategy.name
      };
    }),
    default: strategies.reduce((position: number, strategy: IStrategyDictItem, index: number) => {
      if (authContext.strategy === strategy.id) {
        position = index;
      }
      return position;
    }, 0)
  }];
  // tslint:disable-next-line:no-shadowed-variable
  return inquirer.prompt(promptFor)
    .then((answers: inquirer.Answers) => {
      return {
        ...answersAll,
        ...answers
      };
    });
};

export default wizard;
