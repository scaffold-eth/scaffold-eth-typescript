import json from './scaffold.config.json';

import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';

/**
 * Use this for your app
 */
export const scaffoldConfig: TScaffoldConfig = scaffoldConfigSchema.parse(json);

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
