const path = require('path');
const AuthConfig = require('../dist/index').AuthConfig;

const authConfig = new AuthConfig({
  configPath: path.join(__dirname, '../config/private.json'),
  defaultConfigPath: path.join(__dirname, '../config/default.json'),
  forcePrompts: true
});

authConfig.getContext()
  .then(context => {
    console.log(JSON.stringify(context, null, 2));
  })
  .catch(error => {
    console.log(error);
  });
