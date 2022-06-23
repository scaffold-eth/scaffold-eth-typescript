import { Command } from 'commander';

import { TNetworkNames } from '@scaffold-eth/common/src/models/TNetworkNames';
import { invariant } from 'ts-invariant';
import { createConfig } from './createConfig';

const program = new Command();

program.name('scaffold-eth').description('Scaffold-eth-typescript Commands');
program
  .command('create-config')
  .argument('[ethereum toolkit]', ':  Ethereum tooklit to use (`hardhat` or `foundry`)', 'hardhat')
  .argument('[target networks]', ':  An array of networks to target', ['localhost'])
  .action(createConfig);

program.parse();
