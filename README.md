# node-sp-auth-config - Config options builder for node-sp-auth (SharePoint Authentication in Node.js)

[![NPM](https://nodei.co/npm/node-sp-auth-config.png?mini=true&downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-sp-auth-config/)

[![npm version](https://badge.fury.io/js/node-sp-auth-config.svg)](https://badge.fury.io/js/node-sp-auth-config)
[![Downloads](https://img.shields.io/npm/dm/node-sp-auth-config.svg)](https://www.npmjs.com/package/node-sp-auth-config)
[![Actions Status](https://github.com/koltyakov/node-sp-auth-config/workflows/Node%20CI/badge.svg)](https://github.com/koltyakov/node-sp-auth-config/actions)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkoltyakov%2Fnode-sp-auth-config.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkoltyakov%2Fnode-sp-auth-config?ref=badge_shield)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/sharepoint-node/Lobby)

`node-sp-auth-config` provides wizard-like approach for building and managing config files for [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth) (Node.js to SharePoint unattended http authentication). Includes CLI for generating config files from command prompt.

**Versions supported**:

- SharePoint Online
- SharePoint 2019
- SharePoint 2016
- SharePoint 2013
- SharePoint 2010 (limited support)

**Authentication options**:

- SharePoint Online:
  - User credentials (SAML/ADFS)
  - Add-In Only permissions
  - On-Demand authentication (using Electron popup)
- SharePoint 2019, 2016, 2013:
  - User credentials (NTLM, NTLM v2)
  - ADFS user credentials
  - Form-based authentication (FBA)
  - Form-based authentication (Forefront TMG)
  - Add-In Only permissions
  - On-Demand authentication (using Electron popup)
- SharePoint 2010:
  - User credentials (NTLM, NTMLv2)
  - Form-based authentication (FBA)
  - Form-based authentication (Forefront TMG)

Config layer and auth supports Office 365 Dedicated (SPO on custom domain) as well.

---

## How to use

### Install

```bash
npm install node-sp-auth-config --save
```

or install globally to use as CLI:

```bash
npm install node-sp-auth-config -g
```

### Usage as CLI

```bash
sp-auth init --path ./config/private.config.json
sp-auth --help # for help about parameters
```

### Usage in TypeScript

```javascript
import { AuthConfig } from 'node-sp-auth-config';

const authConfig = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
});

authConfig.getContext()
  .then((context) => {
    console.log(JSON.stringify(context, null, 2));
    // context.authOptions - node-sp-auth authentication options
  })
  .catch(console.warn);
```

### Usage in JavaScript

```javascript
const AuthConfig = require('node-sp-auth-config').AuthConfig;

const authConfig = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
});

authConfig.getContext()
  .then((context) => {
    console.log(JSON.stringify(context, null, 2));
    // context.authOptions - node-sp-auth authentication options
  })
  .catch(console.warn);
```

#### Initiation parameters

| Parameter | Default value | Description |
| --- | --- | --- |
| configPath | '`./config/private.json`' | Path to auth config `.json` |
| encryptPassword | `true` | Encrypt password to a machine-bind hash |
| saveConfigOnDisk | `true` | Save config `.json` to disk |
| forcePrompts | `false` | Force parameters prompts |
| headlessMode | `false` | Prevents interactive prompts - for headless, CI/CD processes |
| defaultConfigPath | empty | Path to `.json` config, parameters from which are placed as defaults |
| authOptions | empty | Any valid `node-sp-auth` options |

### Production runtime

#### Headless mode

When using in a headless mode, in case of missing parameters, one can expect non-interactive behavior with no prompts but graceful exit with corresponding error output.

This can be achieved by providing `headlessMode` settings property is equal to `true`.

The headless mode also automatically configured when `NODE_ENV` (or `SPAUTH_ENV`) environment variable is equal to `production`.

#### Environment variables

All the parameters which are usually stored in `private.json` can be defined also using environment variables. Environment variables started with `SPAUTH_` prefix are recognized with the library. Second part of the name is an actual name of the `node-sp-auth` credentials property yet in uppercase (e.g. `SPAUTH_SITEURL`, `SPAUTH_USERNAME`, `SPAUTH_PASSWORD`).

Along with credentials props these service variables are used:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | When equal to `production` forces `headlessMode`. |
| `SPAUTH_ENV` | When equal to `production` forces `headlessMode`. Overwrites `NODE_ENV`. |
| `SPAUTH_FORCE` | Makes `SPAUTH_{CREDENTIALS}` variables take precedence over those possibly stored in `private.json`. |


## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkoltyakov%2Fnode-sp-auth-config.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkoltyakov%2Fnode-sp-auth-config?ref=badge_large)
