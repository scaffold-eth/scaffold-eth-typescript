import chalk from 'chalk';

import { set, editor } from '~~/helpers/configManager';
import { TSolidityToolkits, TNetworkNames, TReactBuild } from '~common/models';
import { scaffoldConfigSchema, TScaffoldConfig } from '~~/models/TScaffoldConfig';

export const createConfig = (config: TScaffoldConfig) => {
  set('build', config.build);
  set('runtime', config.runtime);

  editor.save();
  console.log(chalk.green(`✅ Success! Created scaffold.config.json in packages/common`));
  console.log(chalk.green('With: '), config);
};

export const parseCreateConfigArgs = (...args: string[]): Parameters<typeof createConfig> => {
  console.log();
  try {
    const input: TScaffoldConfig = {
      build: {
        solidityToolkit: args[0] as TSolidityToolkits,
        reactBuild: args[2] as TReactBuild,
      },
      runtime: {
        targetNetworks: args[1].split(',').map((x) => x.trim()) as TNetworkNames[],
      },
    };

    const config = scaffoldConfigSchema.safeParse(input);

    if (config.success == false) {
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
