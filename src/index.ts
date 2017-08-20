import * as fs from 'fs';
import * as path from 'path';
import { Cpass } from 'cpass';
import * as spauth from 'node-sp-auth';

// Utils
import { convertSettingsToAuthContext, saveConfigOnDisk } from './utils';

// Step wizards
import siteUrlWizard from './wizards/siteUrl';
import strategyWizard from './wizards/chooseStrategy';
import credentialsWizard from './wizards/askCredentials';
import saveOnDiskWizard from './wizards/saveOnDisk';

import { getStrategies, getTargetsTypes } from './config';

// Auth interfaces >>>
import { IAuthOptions, IAuthResponse } from 'node-sp-auth';
// <<< Auth interfaces

import {
    IAuthContext, IAuthContextSettings, IStrategyDictItem,
    IAuthConfigSettings, ICheckPromptsResponse
} from './interfaces';

const cpass = new Cpass();

export class AuthConfig {

    private settings: IAuthConfigSettings;
    private targets: string[];
    private strategies: IStrategyDictItem[];
    private context: IAuthContextSettings;

    constructor(settings: IAuthConfigSettings = {}) {
        this.strategies = getStrategies();
        this.targets = getTargetsTypes();
        this.settings = {
            ...settings,
            configPath: path.resolve(settings.configPath || './config/private.json'),
            encryptPassword: typeof settings.encryptPassword !== 'undefined' ? settings.encryptPassword : true,
            saveConfigOnDisk: typeof settings.saveConfigOnDisk !== 'undefined' ? settings.saveConfigOnDisk : true
        };
    }

    public getContext = (): Promise<IAuthContext> => {
        // console.log('Config path: ' + this.settings.configPath);
        return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
            return this.checkForPrompts()
                .then(checkPromptsResponse => {
                    let authContext: IAuthContext = {
                        ...checkPromptsResponse.authContext
                    };

                    if (!checkPromptsResponse.needPrompts) {

                        if (checkPromptsResponse.needSave) {
                            saveConfigOnDisk(authContext, this.settings)
                                .then(() => {
                                    resolve(authContext);
                                });
                        } else {
                            resolve(authContext);
                        }

                    } else {

                        // Step 1: Require SharePoint URL
                        return siteUrlWizard(authContext, {}, this.settings)
                            .then((answersResult) => {
                                // Step 2: SharePoint Online/OnPremise autodetection
                                return strategyWizard(authContext, answersResult, this.settings);
                            })
                            .then((answersResult) => {
                                // Step 3: Ask for strategy specific parameters
                                return credentialsWizard(authContext, answersResult, this.settings);
                            })
                            .then((answersResult) => {
                                // Step 4: Save on disk
                                return saveOnDiskWizard(authContext, answersResult, this.settings);
                            })
                            .then((answersResult) => {
                                // Return wizard data
                                return resolve(convertSettingsToAuthContext(answersResult as any));
                            });

                    }
                });

        });
    }

    private tryAuth = (authContext: IAuthContext): Promise<IAuthResponse> => {
        return <any>spauth.getAuth(authContext.siteUrl, authContext.authOptions);
    }

    private checkForPrompts = (): Promise<ICheckPromptsResponse> => {
        let getJsonContent = (filePath: string, jsonData?: IAuthOptions): Promise<any> => {
            return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
                if (typeof jsonData === 'undefined') {
                    fs.exists(filePath, (exists: boolean) => {
                        let jsonRawData: any = {};
                        if (exists) {
                            jsonRawData = require(path.resolve(filePath));
                        }
                        resolve({
                            exists,
                            jsonRawData
                        });
                    });
                } else {
                    resolve({
                        exists: true,
                        jsonRawData: jsonData
                    });
                }
            });
        };
        let runCheckForPrompts = (checkObject: ICheckPromptsResponse): Promise<ICheckPromptsResponse> => {
            return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
                getJsonContent(this.settings.configPath, this.settings.authOptions)
                    .then(check => {
                        checkObject.needPrompts = !check.exists;
                        checkObject.jsonRawData = check.jsonRawData;
                        return checkObject;
                    })
                    .then(checkObj => {
                        if (typeof this.settings.defaultConfigPath !== 'undefined') {
                            return getJsonContent(this.settings.defaultConfigPath)
                                .then(check => {
                                    checkObj.jsonRawData = {
                                        ...check.jsonRawData,
                                        ...checkObj.jsonRawData
                                    };
                                    return checkObject;
                                });
                        } else {
                            return checkObj;
                        }
                    })
                    .then(checkObj => {

                        this.context = (checkObj.jsonRawData as IAuthContextSettings);

                        let withPassword: boolean;
                        let strategies = this.strategies.filter((strategy: IStrategyDictItem) => {
                            return strategy.id === this.context.strategy;
                        });
                        if (strategies.length === 1) {
                            withPassword = strategies[0].withPassword;
                        } else {
                            withPassword = typeof this.context.password !== 'undefined';
                        }

                        // Strategies with password
                        if (withPassword) {
                            let initialPassword = `${this.context.password || ''}`;
                            if (this.context.password === '' || typeof this.context.password === 'undefined') {
                                checkObj.needPrompts = true;
                            } else {
                                this.context.password = cpass.decode(this.context.password);
                                let decodedPassword = this.context.password;
                                let encodedPassword = cpass.encode(decodedPassword);
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
                            resolve(checkObj);
                        } else {
                            // No strategies found
                            if (checkObj.needPrompts) {
                                resolve(checkObj);
                            } else {
                                this.tryAuth(checkObj.authContext)
                                    .then(() => {
                                        checkObj.needPrompts = false;
                                        resolve(checkObj);
                                    })
                                    .catch((error: any) => {
                                        checkObj.needPrompts = true;
                                        resolve(checkObj);
                                    });
                            }
                        }
                    });
            });
        };
        let checkPromptsObject: ICheckPromptsResponse = {
            needPrompts: true,
            needSave: false
        };
        return runCheckForPrompts(checkPromptsObject);
    }

}

export { IAuthContext, IAuthConfigSettings } from './interfaces';
export { IAuthOptions } from 'node-sp-auth';
