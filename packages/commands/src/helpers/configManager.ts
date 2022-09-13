import chalk from 'chalk';
import editJson from 'edit-json-file';

import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';

const packagesPath = '../../packages';
const configPath = packagesPath + '/common/src/scaffold.config.json';

export const editor = editJson(configPath);

type TConfigKeys = keyof TScaffoldConfig;
export const set = (key: TConfigKeys, value: any): void => {
  editor.set(key, value);
};

export const load = (): TScaffoldConfig => {
  const input = editor.read();
  const config = scaffoldConfigSchema.safeParse(input);

  if (config.success) {
    return config.data;
  } else {
    console.log(chalk.red('❌ Error! Invalid scaffold.config.json!'));
    console.log(chalk.yellow('🏁 Did you run `yarn scaffold create-config`?'));
    console.log(config.error);
    throw 'Error, Invalid Scaffold Config: scaffold.config.json';
  }
};

export const printConfig = (config: TScaffoldConfig): void => {
  console.log('----------------------------------------------------');
  console.log(chalk.green('✔️  Loaded scaffold.config.json:'));
  console.log(config);
  console.log('----------------------------------------------------');
  console.log();
};
