import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { Cpass } from 'cpass';

import { IAuthContext, IAuthContextSettings, IAuthConfigSettings } from '../interfaces';

export const convertAuthContextToSettings = (authContext: IAuthContext, settings: IAuthConfigSettings = {}): IAuthContextSettings => {
  const passwordPropertyName = getHiddenPropertyName(authContext.authOptions as any);
  const password = (authContext.authOptions as any)[passwordPropertyName];
  let plainContext: IAuthContextSettings = {
    siteUrl: authContext.siteUrl,
    strategy: authContext.strategy,
    ...authContext.authOptions,
    custom: authContext.custom
  };
  if (typeof password !== 'undefined' && settings.encryptPassword) {
    const cpass = new Cpass(settings.masterKey);
    const decodedPassword = cpass.decode(password);
    const encodedPassword = cpass.encode(decodedPassword);
    plainContext = {
      ...plainContext,
      [passwordPropertyName]: encodedPassword
    };
  }
  return plainContext;
};

export const convertSettingsToAuthContext = (configObject: IAuthContextSettings, settings: IAuthConfigSettings = {}): IAuthContext => {
  const formattedContext: IAuthContext = {
    siteUrl: configObject?.siteUrl.split('#')[0] || '',
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

export const saveConfigOnDisk = (authContext: IAuthContext, settings: IAuthConfigSettings): Promise<void> => {
  return new Promise((resolve, reject) => {
    const configDataJson = convertAuthContextToSettings(authContext, settings);
    const saveFolderPath = path.dirname(settings.configPath);
    mkdirp(saveFolderPath).then(() => {
      const data = JSON.stringify(configDataJson, null, 2);
      fs.writeFile(settings.configPath, data, 'utf8', (err) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve();
      });
    }).catch((ex) => {
      console.error(`Error creating folder "${saveFolderPath}"`, ex);
    });
  });
};

export const defaultPasswordMask = '********';

export const getHiddenPropertyName = (data: { [key: string]: string; }): string => {
  if (data.password) {
    return 'password';
  }
  if (data.clientSecret) {
    return 'clientSecret';
  }
  return undefined;
};

export const isOnPrem = (siteUrl: string): boolean => {
  if (siteUrl.toLocaleLowerCase().indexOf('#spo') !== -1) {
    return false;
  }
  const host = url.parse(siteUrl.toLocaleLowerCase()).host || '';
  return [
    '.sharepoint.com',
    '.sharepoint.cn',
    '.sharepoint.de',
    '.sharepoint-mil.us',
    '.sharepoint.us'
  ]
    .filter((uri) => host.indexOf(uri) !== -1)
    .length === 0;
};
