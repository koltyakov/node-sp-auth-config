import * as path from 'path';
import { AuthConfig } from '../src/index';

process.env['SPAUTH_SITEURL'] = 'https://contoso.sharepoint.com/sites/site';
// process.env['SPAUTH_STRATEGY'] = 'UserCredentials';
process.env['SPAUTH_USERNAME'] = 'user@contoso.onmicrosoft.com';
process.env['SPAUTH_PASSWORD'] = 'secret';

// process.env['NODE_ENV'] = 'production'; // Suppress prompts
// or
process.env['SPAUTH_ENV'] = 'production';
process.env['SPAUTH_FORCE'] = 'true';

const authConfig = new AuthConfig({
  configPath: path.join(__dirname, '../config/private-fake.json'),
  defaultConfigPath: path.join(__dirname, '../config/default-fake.json'),
  saveConfigOnDisk: false
});

authConfig.getContext()
  .then(context => {
    console.log(JSON.stringify(context, null, 2));
  })
  .catch(console.log);
