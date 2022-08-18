import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';

// this logic is a bit redundant, as it has to work with esm, commonjs and hardhat

export let scaffoldConfig: TScaffoldConfig;
export const loadScaffoldConfig = async (): Promise<TScaffoldConfig> => {
  const data = await import('~common/scaffold.config.json');
  scaffoldConfig = scaffoldConfigSchema.parse(data);

  console.log('...done loading scaffold config');
  return scaffoldConfig;
};

void loadScaffoldConfig();
export default scaffoldConfig;
