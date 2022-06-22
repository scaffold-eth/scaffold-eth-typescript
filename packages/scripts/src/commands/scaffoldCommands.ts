import { Command } from 'commander';
import editJson from 'edit-json-file';
import chalk from 'chalk';

import { EtherumToolkits, TScaffoldConfig } from '@scaffold-eth/common/src/models/TScaffoldConfig';
import { NetworkNames, TNetworkNames } from '@scaffold-eth/common/src/models/TNetworkNames';
import { invariant } from 'ts-invariant';

const packagesPath = '../../packages';
const configPath = packagesPath + '/common/scaffold.config.json';
const editor = editJson(configPath);
type TConfigKeys = keyof TScaffoldConfig;

const program = new Command();

const set = (key: TConfigKeys, value: any) => {
  editor.set(key, value);
};

program.name('scaffold-eth').description('Scaffold-eth-typescript Commands');

program
  .command('init')
  .argument('[ethereum toolkit>]', 'Ethereum tooklit to use (`hardhat` or `foundry`)', 'hardhat')
  .argument('[target networks]', 'an array of networks to target', ['localhost'])
  .action((toolkit, targetNetworks) => {
    invariant(Array.isArray(targetNetworks), 'targetNetworks is not an array!  It should of type TNetworkNames[]');

    if (Array.isArray(targetNetworks)) {
      const names = Object.keys(NetworkNames);

      if (!targetNetworks.every((f) => names.some((n) => n == f))) {
        chalk.bgYellow('The target network you provided is not part of TNetworkNames type');
        return;
      }
    }

    invariant(
      EtherumToolkits.find((f) => f == toolkit),
      'Toolkit is not correct.  It should of type EthereumToolkits. (hardhat, forge, etc..)'
    );

    set('ethereumToolkit', toolkit);
    set('targetEnvironment', targetNetworks);

    editor.save();
  });

program.parse();
