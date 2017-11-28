import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fs from 'fs';
import { Cpass } from 'cpass';

import { IAuthContext, IAuthContextSettings, IAuthConfigSettings } from '../interfaces';

const cpass = new Cpass();

export const convertAuthContextToSettings = (authContext: IAuthContext, settings: IAuthConfigSettings = {}): IAuthContextSettings => {
  let password = (authContext.authOptions as any).password;
  let plainContext: IAuthContextSettings = {
    siteUrl: authContext.siteUrl,
    strategy: authContext.strategy,
    ...authContext.authOptions
  };
  if (typeof password !== 'undefined' && settings.encryptPassword) {
    let decodedPassword = cpass.decode(password);
    let encodedPassword = cpass.encode(decodedPassword);
    plainContext = {
      ...plainContext,
      password: encodedPassword
    };
  }
  return plainContext;
};

export const convertSettingsToAuthContext = (configObject: IAuthContextSettings): IAuthContext => {
  let formattedContext: IAuthContext = {
    siteUrl: configObject.siteUrl || '',
    strategy: configObject.strategy,
    authOptions: {
      ...(configObject as any)
    }
  };
  delete (formattedContext.authOptions as any).siteUrl;
  delete (formattedContext.authOptions as any).strategy;
  return formattedContext;
};

export const saveConfigOnDisk = (authContext: IAuthContext, settings: IAuthConfigSettings): Promise<any> => {
  return new Promise((resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
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
