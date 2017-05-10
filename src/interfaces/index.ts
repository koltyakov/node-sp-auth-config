// Auth interfaces
import {
    IOnPremiseAddinCredentials, IOnpremiseUserCredentials, IOnpremiseFbaCredentials,
    IOnlineAddinCredentials, IUserCredentials, IAdfsUserCredentials
} from 'node-sp-auth';
// Auth interfaces

export interface IAuthContext {
    siteUrl: string;
    strategy?: 'OnPremiseAddinCredentials' | 'OnpremiseUserCredentials' | 'OnpremiseFbaCredentials' |
               'OnlineAddinCredentials' | 'UserCredentials' | 'AdfsUserCredentials';
    authOptions: IOnPremiseAddinCredentials | IOnpremiseUserCredentials | IOnpremiseFbaCredentials |
                 IOnlineAddinCredentials | IUserCredentials | IAdfsUserCredentials;
}

export interface IAuthContextSettings {
    siteUrl: string;
    strategy?: 'OnPremiseAddinCredentials' | 'OnpremiseUserCredentials' | 'OnpremiseFbaCredentials' |
               'OnlineAddinCredentials' | 'UserCredentials' | 'AdfsUserCredentials';
    [name: string]: any;
}

export interface IStrategyDictItem {
    id: 'OnPremiseAddinCredentials' | 'OnpremiseUserCredentials' | 'OnpremiseFbaCredentials' |
        'OnlineAddinCredentials' | 'UserCredentials' | 'AdfsUserCredentials';
    withPassword: boolean;
    target: ('OnPremise' | 'Online')[];
    name: string;
    verifyCallback?: Function;
}

export interface IAuthConfigSettings {
    configPath?: string;
    defaultConfigPath?: string;
    encryptPassword?: boolean;
    saveConfigOnDisk?: boolean;
}

export interface ICheckPromptsResponse {
    needPrompts: boolean;
    needSave: boolean;
    authContext?: IAuthContext;
    jsonRawData?: any;
}
