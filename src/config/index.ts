import * as spauth from 'node-sp-auth';
import { IStrategyDictItem } from '../interfaces';

export const getTargetsTypes = (): string[] => {
  return ['Online', 'OnPremise'];
};

export const getStrategies = (): IStrategyDictItem[] => {
  const strategies: IStrategyDictItem[] = [
    {
      id: 'OnpremiseUserCredentials',
      name: 'User credentials (NTLM)',
      withPassword: true,
      target: ['OnPremise'],
      verifyCallback: spauth.isUserCredentialsOnpremise
    },
    {
      id: 'AdfsUserCredentials',
      name: 'ADFS user credentials (On-Prem)',
      withPassword: true,
      target: ['OnPremise'],
      verifyCallback: (...args: any[]) => spauth.isAdfsCredentials(args[1])
    },
    {
      id: 'OnpremiseFbaCredentials',
      name: 'Form-based authentication (FBA)',
      withPassword: true,
      target: ['OnPremise'],
      verifyCallback: spauth.isFbaCredentialsOnpremise
    },
    {
      id: 'OnpremiseTmgCredentials',
      name: 'Form-based authentication (Forefront TMG)',
      withPassword: true,
      target: ['OnPremise'],
      verifyCallback: spauth.isTmgCredentialsOnpremise
    },
    {
      id: 'OnPremiseAddinCredentials',
      name: 'Add-In Only permissions (On-Prem)',
      withPassword: false,
      target: ['OnPremise'],
      verifyCallback: (...args: any[]) => spauth.isAddinOnlyOnpremise(args[1])
    },
    {
      id: 'UserCredentials',
      name: 'User credentials (SAML/ADFS)',
      withPassword: true,
      target: ['Online'],
      verifyCallback: spauth.isUserCredentialsOnline
    },
    {
      id: 'OnlineAddinCredentials',
      name: 'Add-In Only permissions',
      withPassword: true,
      target: ['Online'],
      verifyCallback: (...args: any[]) => spauth.isAddinOnlyOnline(args[1])
    },
    {
      id: 'OnDemandCredentials',
      name: 'On-Demand credentials (Electron@8 is required, not compatible with NTLM)',
      withPassword: false,
      target: ['Online', 'OnPremise'],
      verifyCallback: (...args: any[]) => spauth.isOndemandCredentials(args[1])
    },
    // Office 365 Dedicated
    {
      id: 'UserCredentials',
      name: 'User credentials - SAML/ADFS (SPO, O365 Dedicated)',
      withPassword: true,
      target: ['O365Dedicated'],
      verifyCallback: spauth.isUserCredentialsOnline,
      withSeparator: true
    },
    {
      id: 'OnlineAddinCredentials',
      name: 'Add-In Only permissions (SPO, O365 Dedicated)',
      withPassword: true,
      target: ['O365Dedicated'],
      verifyCallback: (...args: any[]) => spauth.isAddinOnlyOnline(args[1])
    },
  ];

  return strategies;
};
