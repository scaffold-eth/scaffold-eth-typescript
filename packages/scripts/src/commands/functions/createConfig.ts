import chalk from 'chalk';

import { set, editor } from '~~/helpers/configManager';
import { TEthereumToolkits, TNetworkNames } from '~common/models';
import { scaffoldConfigSchema, TScaffoldConfig } from '~~/models/TScaffoldConfig';

export const createConfig = (config: TScaffoldConfig) => {
  set('ethereumToolkit', config.ethereumToolkit);
  set('targetNetworks', config.targetNetworks);

  editor.save();
  console.log(chalk.green(`✅ Success! Created scaffold.config.json in packages/common`));
  console.log(chalk.green('With: '), config);
};

export const parseCreateConfigArgs = (...args: string[]): Parameters<typeof createConfig> => {
  console.log();
  try {
    const ethereumToolkit: TEthereumToolkits = args[0] as TEthereumToolkits;
    const targetNetworks: TNetworkNames[] = args[1].split(',').map((x) => x.trim()) as TNetworkNames[];

    const config = scaffoldConfigSchema.safeParse({
      ethereumToolkit: ethereumToolkit,
      targetNetworks: targetNetworks,
    });

    if (config.success == false) {
      console.log(chalk.red('❌ Error! Invalid config values!'));
      config.error.errors.forEach((err) => {
        console.log(chalk.red('  -  ', err.message, ';'));
      });
      console.log('arguments: ', ethereumToolkit, targetNetworks);
      throw '';
    }

    return [config.data];
  } catch (err) {
    console.log(chalk.red('❌ Error! Invalid parameters, could not parse them!'));
    throw err;
  }
};
