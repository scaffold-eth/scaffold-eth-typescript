import { Command } from 'commander';

import { createConfig } from './functions/createConfig';

const program = new Command();

program.name('scaffold-eth').description('Scaffold-eth-typescript Commands');
program
  .command('create-config')
  .argument('[ethereum toolkit]', ':  Ethereum tooklit to use (`hardhat` or `foundry`) e.g. hardhat', 'hardhat')
  .argument('[target networks]', ':  An array of networks to target. e.g. loacalhost, mainnet', 'localhost')
  .action(createConfig);

program.parse();
