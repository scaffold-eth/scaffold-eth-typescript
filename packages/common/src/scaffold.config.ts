import { invariant } from 'ts-invariant';

import json from './scaffold.config.json';

import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';

export const validatedScaffoldConfigSchema = scaffoldConfigSchema.refine((data) => {
  // additional validation
  if (!data?.runtime?.availableNetworks?.find((f) => f === data.runtime.targetNetwork)) {
    invariant.error(`Default network ${data.runtime.targetNetwork} is not in the target networks list`);
    return false;
  }
  return true;
}, `defaultNetwork must be in the targetNetworks list`);

/**
 * Use this for your app
 */
export const scaffoldConfig = validatedScaffoldConfigSchema.parse(json);

// this logic is a bit redundant, as it has to work with esm, commonjs and hardhat

/**
 * use this for hardhat and node commonjs
 */
let configForHardhat: TScaffoldConfig = scaffoldConfig;
export const loadScaffoldConfig = async (): Promise<TScaffoldConfig> => {
  const data = await import('~common/scaffold.config.json');
  configForHardhat = validatedScaffoldConfigSchema.parse(data);

  console.log('...done loading scaffold config');
  return scaffoldConfig;
};

/**
 * use this for hardhat
 */
export default configForHardhat;
