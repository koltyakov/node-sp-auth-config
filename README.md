# node-sp-auth-config - Config options builder for node-sp-auth (SharePoint Authentication in Node.js)

[![NPM](https://nodei.co/npm/node-sp-auth-config.png?mini=true&downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-sp-auth-config/)

[![npm version](https://badge.fury.io/js/node-sp-auth-config.svg)](https://badge.fury.io/js/node-sp-auth-config)
[![Downloads](https://img.shields.io/npm/dm/node-sp-auth-config.svg)](https://www.npmjs.com/package/node-sp-auth-config)

---
### Need help on SharePoint with Node.js? Join our gitter chat and ask question! [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/sharepoint-node/Lobby)
---

`node-sp-auth-config` provides wizard-like approach for building and managing config files for [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth) (Node.js to SharePoint unattended http authentication).

Versions supported:

- SharePoint 2013
- SharePoint 2016
- SharePoint Online

Authentication options:

- SharePoint 2013, 2016:
  - Addin only permissions
  - User credentials through the http ntlm handshake
  - Form-based authentication (FBA)
  - Forefront TMG authentication
- SharePoint Online:
  - Addin only permissions
  - SAML based with user credentials
  - ADFS user credentials (works with both SharePoint on-premise and Online)

---

## How to use

### Install

```bash
npm install node-sp-auth-config --save
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
    .then(context => {
        console.log(JSON.stringify(context, null, 2));
        // context.authOptions - node-sp-auth authentication options
    })
    .catch(error => {
        console.log(error);
    });
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
    .then(context => {
        console.log(JSON.stringify(context, null, 2));
        // context.authOptions - node-sp-auth authentication options
    })
    .catch(error => {
        console.log(error);
    });
```

#### Initiation parameters

- configPath?: string;          // Path to auth config .json | Default is './config/private.json'
- encryptPassword?: boolean;    // Encrypt password to a machine-bind hash | Default is 'true'
- saveConfigOnDisk?: boolean;   // Save config .json to disk | Default is 'true'