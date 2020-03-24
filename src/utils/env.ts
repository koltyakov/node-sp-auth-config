const authPropsMapping = {
  siteurl: 'siteUrl',
  strategy: 'strategy',
  username: 'username',
  password: 'password',
  relyingparty: 'relyingParty',
  adfsurl: 'adfsUrl',
  adfscookie: 'adfsCookie',
  ondemand: 'ondemand',
  clientid: 'clientId',
  clientsecret: 'clientSecret',
  issuerid: 'issuerId',
  realm: 'realm',
  rsaprivatekeypath: 'rsaPrivateKeyPath',
  shathumbprint: 'shaThumbprint',
  fba: 'fba',
  tmg: 'tmg',
  domain: 'domain',
  online: 'online'
};

export interface IAuthEnvProps {
  [key: string]: string;
  custom?: any;
}

export const getConfigFromEnvVariables = (): IAuthEnvProps | null => {
  const prefix = 'SPAUTH_';
  const authProps = Object.keys(process.env)
    .filter((key) => key.indexOf(prefix) === 0)
    .reduce((res, key) => {
      const authProp = authPropsMapping[key.replace(prefix, '').toLowerCase()];
      if (typeof authProp !== 'undefined') {
        res[authProp] = process.env[key];
      }
      if (authProp === 'custom') {
        try {
          (res as any).custom = JSON.parse(process.env[key]);
        } catch (ex) { /**/ }
      }
      return res;
    }, {});
  if (Object.keys(authProps).length === 0) {
    return null;
  }
  return authProps;
};
