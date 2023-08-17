import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { INGESTION_SOURCE_IDS } from './steps/constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [INGESTION_SOURCE_IDS.ISSUES]: {
    title: 'Issues',
    description: 'Ingestion source that groups issue steps',
    defaultsToDisabled: false,
    cannotBeDisabled: false,
  },
};
