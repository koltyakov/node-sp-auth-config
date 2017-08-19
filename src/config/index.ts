import * as spauth from 'node-sp-auth';
import { IStrategyDictItem } from '../interfaces';

export const getTargetsTypes = (): string[]  => {
    return [ 'Online', 'OnPremise' ];
};

export const getStrategies = (): IStrategyDictItem[] => {
    const strategies: IStrategyDictItem[] = [
        {
            id: 'OnpremiseUserCredentials',
            name: 'User credentials (NTLM)',
            withPassword: true,
            target: [ 'OnPremise' ],
            verifyCallback: spauth.isUserCredentialsOnpremise
        }, {
            id: 'OnpremiseFbaCredentials',
            name: 'Form-based authentication (FBA)',
            withPassword: true,
            target: [ 'OnPremise' ],
            verifyCallback: spauth.isFbaCredentialsOnpremise
        }, {
            id: 'OnPremiseAddinCredentials',
            name: 'Add-In only permissions',
            withPassword: false,
            target: [ 'OnPremise' ],
            verifyCallback:  (...args: any[]) => {
                return spauth.isAddinOnlyOnpremise(args[1]);
            }
        }, {
            id: 'UserCredentials',
            name: 'User credentials (SAML)',
            withPassword: true,
            target: [ 'Online' ],
            verifyCallback: spauth.isUserCredentialsOnline
        }, {
            id: 'OnlineAddinCredentials',
            name: 'Add-In only permissions',
            withPassword: false,
            target: [ 'Online' ],
            verifyCallback: (...args: any[]) => {
                return spauth.isAddinOnlyOnline(args[1]);
            }
        }, {
            id: 'AdfsUserCredentials',
            name: 'ADFS user credentials',
            withPassword: true,
            target: [ 'Online', 'OnPremise' ],
            verifyCallback: (...args: any[]) => {
                return spauth.isAdfsCredentials(args[1]);
            }
        }, {
            id: 'OnDemandCredentials',
            name: 'On-demand credentials',
            withPassword: false,
            target: [ 'Online', 'OnPremise' ],
            verifyCallback: (...args: any[]) => {
                return spauth.isOndemandCredentials(args[1]);
            }
        }
    ];

    return strategies;
};
