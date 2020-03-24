import * as fs from 'fs';
import * as path from 'path';
import { Cpass } from 'cpass';
import { getAuth, IAuthOptions, IAuthResponse } from 'node-sp-auth';

// Utils
import { convertSettingsToAuthContext, saveConfigOnDisk, getHiddenPropertyName } from './utils';
import { getConfigFromEnvVariables } from './utils/env';

// Step wizards
import siteUrlWizard from './wizards/siteUrl';
import strategyWizard from './wizards/chooseStrategy';
import credentialsWizard from './wizards/askCredentials';
import saveOnDiskWizard from './wizards/saveOnDisk';

import { getStrategies } from './config'; // getTargetsTypes

import {
  IAuthContext, IAuthContextSettings, IStrategyDictItem,
  IAuthConfigSettings, ICheckPromptsResponse
} from './interfaces';

export class AuthConfig {

  private settings: IAuthConfigSettings;
  // private targets: string[];
  private strategies: IStrategyDictItem[];
  private context: IAuthContextSettings;
  private customData: any;
  private cpass: Cpass;

  constructor (settings: IAuthConfigSettings = {}) {
    this.strategies = getStrategies();
    // this.targets = getTargetsTypes();
    const envMode = process.env.SPAUTH_ENV || process.env.NODE_ENV;
    const headlessMode = typeof settings.headlessMode !== 'undefined' ? settings.headlessMode : envMode === 'production';
    this.settings = {
      ...settings,
      configPath: path.resolve(settings.configPath || './config/private.json'),
      encryptPassword: typeof settings.encryptPassword !== 'undefined' ? settings.encryptPassword : true,
      saveConfigOnDisk: typeof settings.saveConfigOnDisk !== 'undefined' ? settings.saveConfigOnDisk : true,
      headlessMode
    };
    if (typeof this.settings.encryptPassword === 'string') {
      this.settings.encryptPassword = !((this.settings.encryptPassword as string).toLowerCase() === 'false');
    }
    // Check if there is a master key in environment variables, #18
    if (process.env.AUTH_MASTER_KEY && !this.settings.masterKey) {
      this.settings.masterKey = process.env.AUTH_MASTER_KEY;
    }
    this.cpass = new Cpass(this.settings.masterKey);
  }

  public getContext = async (): Promise<IAuthContext> => {
    // console.log('Config path: ' + this.settings.configPath);
    const checkPromptsResponse = await this.checkForPrompts();
    const authContext: IAuthContext = {
      ...checkPromptsResponse.authContext,
      settings: this.settings
    };

    /* === From settings === */
    if (!checkPromptsResponse.needPrompts) {
      if (checkPromptsResponse.needSave) {
        await saveConfigOnDisk(authContext, this.settings);
      }
      return authContext;
    }

    /* === Run Wizard === */
    // Step 1: Require SharePoint URL
    let answersResult = await siteUrlWizard(authContext, this.settings, {});
    // Step 2: SharePoint Online/OnPremise autodetection
    answersResult = await strategyWizard(authContext, this.settings, answersResult);
    // Step 3: Ask for strategy specific parameters
    answersResult = await credentialsWizard(authContext, this.settings, answersResult);
    // Step 4: Save on disk
    if (typeof this.customData !== 'undefined') {
      answersResult.custom = this.customData;
    }
    answersResult = await saveOnDiskWizard(authContext, this.settings, answersResult);
    return convertSettingsToAuthContext(answersResult as any, this.settings);
  }

  private tryAuth = (authContext: IAuthContext): Promise<IAuthResponse> => {
    return getAuth(authContext.siteUrl, authContext.authOptions) as any;
  }

  private checkForPrompts = async (): Promise<ICheckPromptsResponse> => {
    const checkPromptsObject: ICheckPromptsResponse = {
      needPrompts: true,
      needSave: false
    };
    const checkPrompts = await this.runCheckForPrompts(checkPromptsObject);
    const needPrompts = this.settings.headlessMode ? false : checkPrompts.needPrompts;
    return { ...checkPrompts, needPrompts };
  }

  private runCheckForPrompts = async (checkObject: ICheckPromptsResponse): Promise<ICheckPromptsResponse> => {
    const checkObj = { ...checkObject };
    const { exists, jsonRawData } = this.getJsonContent(this.settings.configPath, this.settings.authOptions);
    checkObj.needPrompts = !exists;
    checkObj.jsonRawData = jsonRawData;

    if (typeof this.settings.defaultConfigPath !== 'undefined') {
      checkObj.jsonRawData = {
        ...this.getJsonContent(this.settings.defaultConfigPath).jsonRawData,
        ...checkObj.jsonRawData
      };
    }

    const authPropsFromEnvVariables = getConfigFromEnvVariables();
    if (authPropsFromEnvVariables) {
      checkObj.needPrompts = false;
      const mergeAuthProps = ({ props, custom, mainCustom, mainProps }: any): void => {
        checkObj.jsonRawData = {
          ...props,
          custom: {
            ...custom || {},
            ...mainCustom || {}
          },
          ...mainProps
        };
      };
      if (process.env.SPAUTH_FORCE === 'true') {
        const { custom: mainCustom, ...mainProps } = authPropsFromEnvVariables;
        const { custom, ...props } = checkObj.jsonRawData;
        mergeAuthProps({ props, custom, mainCustom, mainProps });
      } else {
        const { custom: mainCustom, ...mainProps } = checkObj.jsonRawData;
        const { custom, ...props } = authPropsFromEnvVariables;
        mergeAuthProps({ props, custom, mainCustom, mainProps });
      }
    }

    this.context = checkObj.jsonRawData as IAuthContextSettings;

    const strategies = this.strategies.filter(strategy => {
      return strategy.id === this.context.strategy;
    });

    const passwordPropertyName = getHiddenPropertyName(this.context);

    const withPassword = strategies.length === 1
      ? strategies[0].withPassword
      : typeof this.context[passwordPropertyName] !== 'undefined';

    // Strategies with password
    if (withPassword) {
      const initialPassword = `${this.context[passwordPropertyName] || ''}`;
      if (!this.context[passwordPropertyName]) {
        checkObj.needPrompts = true;
      } else {
        this.context[passwordPropertyName] = this.cpass.decode(this.context[passwordPropertyName]);
        const decodedPassword = this.context[passwordPropertyName];
        if (initialPassword === decodedPassword && this.settings.encryptPassword && this.settings.saveConfigOnDisk) {
          checkObj.needSave = true;
        }
      }
    }

    checkObj.authContext = convertSettingsToAuthContext(this.context);

    // Force prompts
    if (this.settings.forcePrompts === true) {
      checkObj.needPrompts = true;
    }

    // Verify strategy parameters
    if (strategies.length === 1) {
      if (!checkObj.needPrompts) {
        checkObj.needPrompts = !strategies[0].verifyCallback(this.context.siteUrl, this.context);
      }
      return checkObj;
    } else {
      // No strategies found
      if (checkObj.needPrompts) {
        return checkObj;
      } else {
        try {
          await this.tryAuth(checkObj.authContext);
          // checkObj.needPrompts = false;
        } catch (ex) {
          checkObj.needPrompts = true;
        }
        return checkObj;
      }
    }
  }

  private getJsonContent = (filePath: string, jsonData?: IAuthOptions): { exists: boolean; jsonRawData: any } => {
    if (typeof jsonData === 'undefined') {
      const exists = fs.existsSync(filePath);
      let jsonRawData: any = {};
      if (exists) {
        try {
          const rawContent = fs.readFileSync(path.resolve(filePath)).toString();
          jsonRawData = JSON.parse(rawContent);
          // jsonRawData = require(filePath);
        } catch (ex) { /**/ }
      }
      if (typeof jsonRawData.custom !== 'undefined') {
        this.customData = jsonRawData.custom;
        delete jsonRawData.custom;
      }
      return { exists, jsonRawData };
    } else {
      return { exists: true, jsonRawData: jsonData };
    }
  }

}

export { IAuthContext, IAuthConfigSettings } from './interfaces';
export { IAuthOptions } from 'node-sp-auth';
