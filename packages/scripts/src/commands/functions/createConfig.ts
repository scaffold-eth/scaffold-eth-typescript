import chalk from 'chalk';

import { set, editor } from '~~/helpers/configManager';
import { TEthereumToolkits, TNetworkNames } from '~common/models';
import { scaffoldConfigSchema } from '~~/models/TScaffoldConfig';

export const createConfig = (ethereumToolkitString: string, targetNetworksString: string) => {
  const targetNetworkArray = targetNetworksString.split(',');
  const config = scaffoldConfigSchema.safeParse({
    ethereumToolkit: ethereumToolkitString,
    targetNetworks: targetNetworkArray,
  });

  if (config.success == false) {
    console.log(chalk.red('❌ Error! Invalid config values!'));
    config.error.errors.forEach((err) => {
      console.log(chalk.red('  -  ', err.message, ';'));
    });
    console.log('arguments: ', ethereumToolkitString, targetNetworksString);
    return;
  }

  set('ethereumToolkit', config.data.ethereumToolkit);
  set('targetNetworks', config.data.targetNetworks);

  editor.save();
  console.log(chalk.green(`✅ Success! Created scaffold.config.json in packages/common`));
  console.log(chalk.green('With: '), config.data);
};
