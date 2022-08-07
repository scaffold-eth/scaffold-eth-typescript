import editJson from 'edit-json-file';
import { TScaffoldConfig } from '~~/models/TScaffoldConfig';

const packagesPath = '../../packages';
const configPath = packagesPath + '/common/scaffold.config.json';

export const editor = editJson(configPath);

type TConfigKeys = keyof TScaffoldConfig;
export const set = (key: TConfigKeys, value: any) => {
  editor.set(key, value);
};

export const load = (): TScaffoldConfig => {
  const config = editor.read();
  return config as TScaffoldConfig;
};
