import * as inquirer from 'inquirer';

import { IOnpremiseUserCredentials } from 'node-sp-auth';
import { IAuthContext, IAuthConfigSettings } from '../../interfaces';
import { defaultPasswordMask } from '../../utils';

const wizard = (authContext: IAuthContext, answersAll: inquirer.Answers = {}, settings: IAuthConfigSettings = {}): Promise<inquirer.Answers> => {
  const onPremiseUserCredentials: IOnpremiseUserCredentials = (authContext.authOptions as IOnpremiseUserCredentials);
  let promptFor: inquirer.Question[] = [
    {
      name: 'username',
      message: 'User name',
      type: 'input',
      default: onPremiseUserCredentials.username,
      validate: (answer: string) => {
        if (answer.length === 0) {
          return false;
        }
        return true;
      }
    }
  ];
  return inquirer.prompt(promptFor)
    .then((answers: inquirer.Answers) => {
      answersAll = {
        ...answersAll,
        ...answers
      };
      let noDomain = false;
      if (answers.username.indexOf('@') !== -1) {
        noDomain = true;
      }
      if (answers.username.indexOf('\\') !== -1) {
        noDomain = true;
        answers.username = answers.username.replace('\\\\', '\\');
        answersAll.domain = answers.username.split('\\')[0];
        answersAll.username = answers.username.split('\\')[1];
      }
      promptFor = [];
      if (!noDomain) {
        promptFor.push({
          name: 'domain',
          message: 'Domain',
          type: 'input',
          default: onPremiseUserCredentials.domain,
          validate: (answer: string) => {
            if (answer.length === 0) {
              return false;
            }
            return true;
          }
        });
      }
      promptFor.push({
        name: 'password',
        message: 'Password',
        type: 'password',
        default: onPremiseUserCredentials.password ? defaultPasswordMask : null,
        validate: (answer: string) => {
          if (answer.length === 0) {
            return false;
          }
          return true;
        }
      });
      return inquirer.prompt(promptFor)
        // tslint:disable-next-line:no-shadowed-variable
        .then((answers: inquirer.Answers) => {
          answersAll = {
            ...answersAll,
            ...answers,
            password: answers.password === defaultPasswordMask
              ? onPremiseUserCredentials.password
              : answers.password
          };
          return answersAll;
        });
    });
};

export default wizard;
