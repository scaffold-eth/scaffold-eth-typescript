import chalk from 'chalk';

import {
  TSolidityToolkits,
  TReactBuilds,
  TNetworkNamesList,
  scaffoldConfigSchema,
  TScaffoldConfig,
} from '~common/models';
import { set, editor, load } from '~~/helpers/configManager';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const createConfig = (config: TScaffoldConfig): void => {
  set('build', config.build);
  set('runtime', config.runtime);

  editor.save();
  console.log(chalk.green(`✅ Success! Created scaffold.config.json in packages/common/src`));
  console.log(chalk.green('With: '), config);
};

export const parseCreateConfigArgs = (...args: string[]): Parameters<typeof createConfig> => {
  console.log();
  try {
    const input: DeepPartial<TScaffoldConfig> = {
      build: {
        solidityToolkit: args[0] as TSolidityToolkits,
        reactBuild: args[1] as TReactBuilds,
      },
      runtime: {
        targetNetwork: args[2] as TNetworkNamesList,
        availableNetworks: args[3]
          .split(',')
          .filter((y) => y.length > 0)
          .map((x) => x.trim()) as TNetworkNamesList[],
      },
    };

    const config = scaffoldConfigSchema.safeParse(input);

    if (config.success === false) {
      console.log(chalk.red('❌ Error! Invalid config values!'));
      config.error.errors.forEach((err) => {
        console.log(chalk.red('  -  ', err.message, ';'));
      });
      console.log('arguments: ', input);
      throw '';
    }

    return [config.data];
  } catch (err) {
    console.log(chalk.red('❌ Error! Invalid parameters, could not parse them!'));
    throw err;
  }
};

export const setConfig = (config: DeepPartial<TScaffoldConfig>): void => {
  const oldConfig = load();
  set('build', { ...oldConfig.build, ...config.build });
  set('runtime', { ...oldConfig.runtime, ...config.runtime });

  editor.save();
  console.log(chalk.green(`✅ Success! Created scaffold.config.json in packages/common/src`));
  console.log(chalk.green('With: '), config);
};

const validateConfig = (input: DeepPartial<TScaffoldConfig>): DeepPartial<TScaffoldConfig> => {
  try {
    const config = scaffoldConfigSchema.deepPartial().safeParse(input);

    if (config.success === false) {
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

export const parseNetwork = (...args: string[]): Parameters<typeof setConfig> => {
  console.log();
  const input: DeepPartial<TScaffoldConfig> = {
    runtime: {
      targetNetwork: args[0] as TNetworkNamesList,
      availableNetworks: args[1]
        .split(',')
        .filter((y) => y.length > 0)
        .map((x) => x.trim()) as TNetworkNamesList[],
    },
  };

  return [validateConfig(input)];
};
