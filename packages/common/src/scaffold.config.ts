import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';
import config from '~common/scaffold.config.json';

export const scaffoldConfig = scaffoldConfigSchema.parse(config);
console.log('sdfdsf');
export const getScaffoldConfig = async (): Promise<TScaffoldConfig> => {
  const data = await import('~common/scaffold.config.json');
  return scaffoldConfigSchema.parse(data);
};
