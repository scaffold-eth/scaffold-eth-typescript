import chalk from 'chalk';

import { set, editor } from '../helpers/configManager';
import { TEthereumToolkits, TNetworkNames } from '~common/models';
import { scaffoldConfigSchema } from '../models/TScaffoldConfig';

export const createConfig = (ethereumToolkit: TEthereumToolkits, targetNetworks: TNetworkNames[]) => {
  let errors = false;

  const config = scaffoldConfigSchema.safeParse({
    ethereumToolkit: ethereumToolkit,
    targetEnvironment: targetNetworks,
  });

  if (config.success == false) {
    console.log(chalk.red('Invalid config'));
    console.log(chalk.yellow(config.error));
  }

  set('ethereumToolkit', ethereumToolkit);
  set('targetNetworks', targetNetworks);

  editor.save();
  console.log(chalk.green(`Success! Created scaffold.config.json in packages/common`));
  console.log('With: ', ethereumToolkit, targetNetworks);
};
