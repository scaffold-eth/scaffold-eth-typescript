import { invariant } from 'ts-invariant';

import json from './scaffold.config.json';

import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';

/**
 * Use this for your app
 */
export const scaffoldConfig: TScaffoldConfig = scaffoldConfigSchema
  .refine((data) => {
    // additional validation
    if (!data?.runtime?.targetNetworks?.find((f) => f === data.runtime.defaultNetwork)) {
      invariant.error(`Default network ${data.runtime.defaultNetwork} is not in the target networks list`);
      return false;
    }
    return true;
  }, `defaultNetwork must be in the targetNetworks list`)
  .parse(json);

// this logic is a bit redundant, as it has to work with esm, commonjs and hardhat

/**
 * use this for hardhat and node commonjs
 */
let configForHardhat: TScaffoldConfig = scaffoldConfig;
export const loadScaffoldConfig = async (): Promise<TScaffoldConfig> => {
  const data = await import('~common/scaffold.config.json');
  configForHardhat = scaffoldConfigSchema.parse(data);

  console.log('...done loading scaffold config');
  return scaffoldConfig;
};

void loadScaffoldConfig();
/**
 * use this for hardhat
 */
// @ts-ignore
export default configForHardhat;
