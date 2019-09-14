import { ListQuestion, ChoiceOptions, Separator, prompt } from 'inquirer';
import { parse } from 'url';

import { getStrategies } from '../config';
import { isOnPrem } from '../utils';

import { IStrategyDictItem } from '../interfaces';
import { IWizardCallback } from '../interfaces/wizard';

const wizard: IWizardCallback = async (authContext, answersAll = {}) => {
  // SharePoint Online/OnPremise autodetection
  const target: ('Online' | 'OnPremise') = isOnPrem(answersAll.siteUrl) ? 'OnPremise' : 'Online';
  const { protocol, host } = parse(answersAll.siteUrl);
  const strategies: IStrategyDictItem[] = getStrategies().filter((strategy) => {
    // SharePoint Dedicated url doesn't stand SPO pattern so giving and option to provide SPO as an option even for OnPrem
    if (
      target === 'OnPremise' &&
      protocol === 'https:' &&
      host.indexOf('.') !== -1 &&
      strategy.target.indexOf('O365Dedicated') !== -1
    ) {
      return true;
    }
    return strategy.target.indexOf(target) !== -1;
  });

  const promptFor: ListQuestion[] = [{
    name: 'strategy',
    message: 'Authentication strategy',
    type: 'list',
    choices: strategies.reduce((choices, strategy) => {
      if (strategy.withSeparator && choices.length > 0) {
        choices.push(new Separator());
      }
      const choice: ChoiceOptions = {
        name: strategy.name,
        value: strategy.id,
        short: strategy.name
      };
      choices.push(choice);
      return choices;
    }, []),
    default: strategies.reduce((position, strategy, index) => {
      if (authContext.strategy === strategy.id) {
        position = index;
      }
      return position;
    }, 0)
  }];

  const answers = await prompt(promptFor);
  return { ...answersAll, ...answers };
};

export default wizard;
