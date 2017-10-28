// Auth interfaces
import { IAuthOptions } from 'node-sp-auth';
// Auth interfaces

export type StrategyCode =
  'OnPremiseAddinCredentials' |
  'OnpremiseUserCredentials' |
  'OnpremiseTmgCredentials' |
  'OnpremiseFbaCredentials' |
  'OnlineAddinCredentials' |
  'UserCredentials' |
  'AdfsUserCredentials' |
  'OnDemandCredentials';

export interface IAuthContext {
  siteUrl: string;
  strategy?: StrategyCode;
  authOptions: IAuthOptions;
}

export interface IAuthContextSettings {
  siteUrl: string;
  strategy?: StrategyCode;
  [name: string]: any;
}

export interface IStrategyDictItem {
  id: StrategyCode;
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
  authOptions?: IAuthOptions;
  forcePrompts?: boolean;
}

export interface ICheckPromptsResponse {
  needPrompts: boolean;
  needSave: boolean;
  authContext?: IAuthContext;
  jsonRawData?: any;
}
