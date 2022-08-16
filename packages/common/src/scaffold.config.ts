import { invariant } from 'ts-invariant';

import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';

console.log('sdfsdf');

export let scaffoldConfig: TScaffoldConfig;
export const loadScaffoldConfig = async (): Promise<TScaffoldConfig> => {
  const data = await import('~common/scaffold.config.json');
  scaffoldConfig = scaffoldConfigSchema.parse(data);

  // additional validation

  if (!data.runtime.targetNetworks.find((f) => f === data.runtime.defaultNetwork)) {
    invariant.error(`Default network ${data.runtime.defaultNetwork} is not in the target networks list`);
  }
  console.log('...done loading scaffold config');
  return scaffoldConfig;
};

void loadScaffoldConfig();
export default scaffoldConfig;
