import { forgeDeploymentBroadcastCollectionSchema, TForgeDeploymentBroadcastCollection } from 'eth-hooks/models';

export const validateBroadcastFile = (json: Record<string, any>): TForgeDeploymentBroadcastCollection => {
  const result = forgeDeploymentBroadcastCollectionSchema.parse(json);
  return result;
};
