import {
  Entity,
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
  createDirectRelationship,
  generateRelationshipType,
} from '@jupiterone/integration-sdk-core';

export const createEntityKey = (
  entityMetadata: StepEntityMetadata,
  id: string,
) => {
  return `${entityMetadata._type}:${id}`;
};

export const generateRelationshipMetadata = ({
  _class,
  from,
  to,
}: {
  _class: RelationshipClass;
  from: StepEntityMetadata;
  to: StepEntityMetadata;
}) =>
  ({
    _type: generateRelationshipType(_class, from, to),
    sourceType: from._type,
    _class,
    targetType: to._type,
  }) satisfies StepRelationshipMetadata;

export const createRelationship = ({
  relationship,
  from,
  to,
}: {
  relationship: StepRelationshipMetadata;
  from: Entity;
  to: Entity;
}) => {
  return createDirectRelationship({
    _class: relationship._class,
    from,
    to,
  });
};
