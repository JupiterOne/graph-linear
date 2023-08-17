import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { INGESTION_SOURCE_IDS } from './steps/constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [INGESTION_SOURCE_IDS.ISSUES]: {
    title: 'Issues',
    description: 'Tasks and subtasks within Linear',
    defaultsToDisabled: false,
    cannotBeDisabled: false,
  },
  [INGESTION_SOURCE_IDS.USERS]: {
    title: 'Users',
    description: 'Individuals that belong to a Linear workspace',
    defaultsToDisabled: false,
    cannotBeDisabled: false,
  },
  [INGESTION_SOURCE_IDS.PROJECTS]: {
    title: 'Projects',
    description: 'Groupings of issues within a Linear workspace',
    defaultsToDisabled: false,
    cannotBeDisabled: false,
  },
};
