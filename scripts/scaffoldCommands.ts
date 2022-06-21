import { Command } from 'commander';
const program = new Command();

program.name('scaffold-eth').description('Scaffold-eth-typescript Commands');

program
  .command('init')
  .argument('[ethereum toolkit>]', 'Ethereum tooklit to use (`hardhat` or `foundry`)', 'hardhat')
  .argument('[target network]', 'an array of networks to target', ['localhost'])
  .action((str, options) => {
    console.log(str, options);
  });

program.parse();
