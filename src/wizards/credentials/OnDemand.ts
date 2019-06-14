import { IWizardCallback } from '../../interfaces/wizard';

const wizard: IWizardCallback = async (_, answersAll = {}) => {
  return {
    ...answersAll,
    ondemand: true
  };
};

export default wizard;
