import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { Cpass } from 'cpass';

import { IAuthContext, IAuthContextSettings, IAuthConfigSettings } from '../interfaces';

export const convertAuthContextToSettings = (authContext: IAuthContext, settings: IAuthConfigSettings = {}): IAuthContextSettings => {
  let passwordPropertyName = getHiddenPropertyName(authContext.authOptions as any);
  let password = (authContext.authOptions as any)[passwordPropertyName];
  let plainContext: IAuthContextSettings = {
    siteUrl: authContext.siteUrl,
    strategy: authContext.strategy,
    ...authContext.authOptions,
    custom: authContext.custom
  };
  if (typeof password !== 'undefined' && settings.encryptPassword) {
    let cpass = new Cpass(settings.masterKey);
    let decodedPassword = cpass.decode(password);
    let encodedPassword = cpass.encode(decodedPassword);
    plainContext = {
      ...plainContext
    };
    plainContext[passwordPropertyName] = encodedPassword;
  }
  return plainContext;
};

export const convertSettingsToAuthContext = (configObject: IAuthContextSettings, settings: IAuthConfigSettings = {}): IAuthContext => {
  let formattedContext: IAuthContext = {
    siteUrl: configObject.siteUrl || '',
    strategy: configObject.strategy,
    authOptions: {
      ...(configObject as any)
    },
    settings,
    custom: configObject.custom
  };
  if (typeof formattedContext.custom === 'undefined') {
    delete formattedContext.custom;
  }
  delete (formattedContext.authOptions as any).siteUrl;
  delete (formattedContext.authOptions as any).strategy;
  delete (formattedContext.authOptions as any).custom;
  return formattedContext;
};

export const saveConfigOnDisk = (authContext: IAuthContext, settings: IAuthConfigSettings): Promise<any> => {
  return new Promise((resolve, reject) => {
    let configDataJson = convertAuthContextToSettings(authContext, settings);
    let saveFolderPath = path.dirname(settings.configPath);
    mkdirp(saveFolderPath, (err: any) => {
      if (err) {
        console.log('Error creating folder ' + '`' + saveFolderPath + ' `', err);
      }
      // tslint:disable-next-line:no-shadowed-variable
      fs.writeFile(settings.configPath, JSON.stringify(configDataJson, null, 2), 'utf8', (err: any) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve();
      });
    });
  });
};

export const defaultPasswordMask: string = '********';

export const getHiddenPropertyName = (data: { [key: string]: string }): string => {
  if (data.password) {
    return 'password';
  }
  if (data.clientSecret) {
    return 'clientSecret';
  }

  return undefined;
};

export const isOnPrem = (siteUrl: string): boolean => {
  let host: string = (url.parse(siteUrl.toLocaleLowerCase())).host;
  return [
    '.sharepoint.com',
    '.sharepoint.cn',
    '.sharepoint.de',
    '.sharepoint-mil.us',
    '.sharepoint.us'
  ]
    .filter(uri => host.indexOf(uri) !== -1)
    .length === 0;
};
