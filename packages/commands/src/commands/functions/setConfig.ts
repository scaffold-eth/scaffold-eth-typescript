import chalk from 'chalk';

import { set, editor, load } from '~~/helpers/configManager';
import { TReactBuilds, TSolidityToolkits } from '~common/models';
import { scaffoldConfigSchema, TScaffoldConfig } from '~common/models';
import { config } from 'shelljs';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const setConfig = (config: DeepPartial<TScaffoldConfig>) => {
  const oldConfig = load();
  set('build', { ...oldConfig.build, ...config.build });
  set('runtime', { ...oldConfig.runtime, ...config.runtime });

  editor.save();
  console.log(chalk.green(`✅ Success! Created scaffold.config.json in packages/common`));
  console.log(chalk.green('With: '), config);
};

const validateConfig = (input: DeepPartial<TScaffoldConfig>): DeepPartial<TScaffoldConfig> => {
  try {
    const config = scaffoldConfigSchema.deepPartial().safeParse(input);

    if (config.success == false) {
      console.log(chalk.red('❌ Error! Invalid config values!'));
      config.error.errors.forEach((err) => {
        console.log(chalk.red('  -  ', err.message, ';'));
      });
      console.log('arguments: ', input);
      throw '';
    }

    return config.data;
  } catch (err) {
    console.log(chalk.red('❌ Error! Invalid parameters, could not parse them!'));
    throw err;
  }
};

export const parseReactBuild = (...args: string[]): Parameters<typeof setConfig> => {
  console.log();
  const input: DeepPartial<TScaffoldConfig> = {
    build: {
      reactBuild: args[0] as TReactBuilds,
    },
  };

  return [validateConfig(input)];
};

export const parseSolidityToolkit = (...args: string[]): Parameters<typeof setConfig> => {
  console.log();
  const input: DeepPartial<TScaffoldConfig> = {
    build: {
      solidityToolkit: args[0] as TSolidityToolkits,
    },
  };

  return [validateConfig(input)];
};
