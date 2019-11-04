import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (_authContext, _settings, answersAll = {}) => {
  return {
    ...answersAll,
    ondemand: true
  };
};

export default wizard;
