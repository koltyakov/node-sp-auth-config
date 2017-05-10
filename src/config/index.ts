import * as spauth from 'node-sp-auth';
import { IStrategyDictItem } from '../interfaces';

export const getTargetsTypes = (): string[]  => {
    return [ 'Online', 'OnPremise' ];
};

export const getStrategies = (): IStrategyDictItem[] => {
    const strategies: IStrategyDictItem[] = [
        {
            id: 'OnpremiseUserCredentials',
            name: 'User credentials through the http ntlm handshake (OnPremise)',
            withPassword: true,
            target: [ 'OnPremise' ],
            verifyCallback: spauth.isUserCredentialsOnpremise
        }, {
            id: 'OnpremiseFbaCredentials',
            name: 'User credentials for form-based authentication (FBA, OnPremise)',
            withPassword: true,
            target: [ 'OnPremise' ],
            verifyCallback: spauth.isFbaCredentialsOnpremise
        }, {
            id: 'OnPremiseAddinCredentials',
            name: 'Addin only permissions (OnPremise)',
            withPassword: false,
            target: [ 'OnPremise' ],
            verifyCallback: spauth.isAddinOnlyOnpremise
        }, {
            id: 'UserCredentials',
            name: 'SAML based with user credentials (Online)',
            withPassword: true,
            target: [ 'Online' ],
            verifyCallback: spauth.isUserCredentialsOnline
        }, {
            id: 'OnlineAddinCredentials',
            name: 'Addin only permissions (Online)',
            withPassword: false,
            target: [ 'Online' ],
            verifyCallback: spauth.isAddinOnlyOnline
        }, {
            id: 'AdfsUserCredentials',
            name: 'ADFS user credentials',
            withPassword: true,
            target: [ 'Online', 'OnPremise' ],
            verifyCallback: spauth.isAdfsCredentials
        }
    ];

    return strategies;
};
