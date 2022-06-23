import chalk from 'chalk';
import { EtherumToolkits } from '@scaffold-eth/common/src/models/TScaffoldConfig';
import { NetworkNames } from '@scaffold-eth/common/src/models/TNetworkNames';
import { set, editor } from '../helpers/configManager';

export const createConfig = (toolkit: string, targetNetworks: string[]) => {
  let errors = false;
  if (!Array.isArray(targetNetworks)) {
    errors = true;
    console.log(chalk.yellow('Error: The target network you provided is not part of TNetworkNames type'));
  } else {
    const names = Object.keys(NetworkNames);
    if (!targetNetworks.every((f) => names.some((n) => n == f))) {
      errors = true;
      console.log(chalk.yellow('Error: The target network you provided is not part of TNetworkNames type'));
    }
  }
  if (!EtherumToolkits.find((f) => f == toolkit)) {
    errors = true;
    console.log(
      chalk.yellow('Error: Toolkit value is not correct.  It should of type EthereumToolkits. (hardhat, forge, etc..)')
    );
  }

  if (errors) {
    console.log(chalk.red('Invalid arguments, aborting'));
    return;
  }

  set('ethereumToolkit', toolkit);
  set('targetEnvironment', targetNetworks);

  editor.save();
  console.log(chalk.green(`Success! Created scaffold.config.json in packages/common`));
  console.log('With: ', toolkit, targetNetworks);
};
