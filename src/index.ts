import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as Cpass from 'cpass';
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
import {
    IOnPremiseAddinCredentials, IOnpremiseUserCredentials, IOnpremiseFbaCredentials,
    IOnlineAddinCredentials, IUserCredentials, IAdfsUserCredentials, IAuthResponse
} from 'node-sp-auth';
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
            configPath: settings.configPath || path.resolve('./config/private.json'),
            encryptPassword: typeof settings.encryptPassword !== 'undefined' ? settings.encryptPassword : true,
            saveConfigOnDisk: typeof settings.saveConfigOnDisk !== 'undefined' ? settings.saveConfigOnDisk : true
        };
    }

    public getContext = (): Promise<IAuthContextSettings> => {
        console.log('Config path: ' + this.settings.configPath);
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
        return spauth.getAuth(authContext.siteUrl, authContext.authOptions);
    }

    private checkForPrompts = (): Promise<ICheckPromptsResponse> => {
        let checkPromptsObject: ICheckPromptsResponse = {
            needPrompts: true,
            needSave: false
        };
        return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
            fs.exists(this.settings.configPath, (exists: boolean) => {
                checkPromptsObject.needPrompts = !exists;

                if (exists) {
                    this.context = require(this.settings.configPath);
                } else {
                    this.context = ({} as IAuthContextSettings);
                }

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
                        checkPromptsObject.needPrompts = true;
                    } else {
                        this.context.password = cpass.decode(this.context.password);
                        let encodedPassword = cpass.encode(this.context.password);
                        if (initialPassword !== encodedPassword && this.settings.encryptPassword && this.settings.saveConfigOnDisk) {
                            checkPromptsObject.needSave = true;
                        }
                    }
                }

                checkPromptsObject.authContext = convertSettingsToAuthContext(this.context);

                // Verify strategy parameters
                if (strategies.length === 1) {
                    if (!checkPromptsObject.needPrompts) {
                        checkPromptsObject.needPrompts = !strategies[0].verifyCallback(this.context.siteUrl, this.context);
                    }
                    resolve(checkPromptsObject);
                } else {
                    // No strategies found
                    if (checkPromptsObject.needPrompts) {
                        resolve(checkPromptsObject);
                    } else {
                        this.tryAuth(checkPromptsObject.authContext)
                            .then(() => {
                                checkPromptsObject.needPrompts = false;
                                resolve(checkPromptsObject);
                            })
                            .catch((error: any) => {
                                checkPromptsObject.needPrompts = true;
                                resolve(checkPromptsObject);
                            });
                    }
                }
            });
        });
    }

}
