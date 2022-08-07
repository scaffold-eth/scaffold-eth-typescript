import { Command } from 'commander';

import { createConfig } from './createConfig';

const program = new Command();

program.name('scaffold-eth').description('Scaffold-eth-typescript Commands');
program
  .command('create-config')
  .argument('[ethereum toolkit]', ':  Ethereum tooklit to use (`hardhat` or `foundry`)', 'hardhat')
  .argument('[target networks]', ':  An array of networks to target', ['localhost'])
  .action(createConfig);

program.parse();
