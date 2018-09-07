import * as path from 'path';
import { sp, Web } from '@pnp/sp';
import { PnpNode } from 'sp-pnp-node';
import { AuthConfig } from '../src/index';

const authConfig = new AuthConfig({
  configPath: path.join(__dirname, './private.json'),
  saveConfigOnDisk: false,
  headlessMode: true
});

authConfig.getContext()
  .then(context => {
    console.log(JSON.stringify(context, null, 2));
    sp.setup({
      sp: {
        fetchClientFactory: () => new PnpNode(context),
        baseUrl: context.siteUrl
      }
    });
    const web = new Web(context.siteUrl);
    web.select('Title').get().then(console.log).catch(_err => {
      console.log(`This should fail by design - test passed!`);
    });
  })
  .catch(console.log);
