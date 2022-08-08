import { Command } from 'commander';
import { buildReact, startReact } from '~~/commands/functions/launch';

import { createConfig, parseCreateConfigArgs } from './functions/createConfig';
import { setConfig, parseReactBuild } from './functions/setConfig';

const program = new Command();

program.name('scaffold').description('Scaffold-Eth-Typescript Commands');
program
  .command('create-config')
  .description('Create the scaffold.config.json file')
  .argument('[solidity toolkit]', ':  Solidity tooklit to use: `hardhat` or `foundry` (e.g. "hardhat")', 'hardhat')
  .argument('[target networks]', ':  An array of networks to target. (e.g. "localhost, mainnet")', 'localhost')
  .argument('[frontend build tool]', 'Use nextjs or vite for your frontend', 'vite')
  .action((...args: string[]) => {
    createConfig(...parseCreateConfigArgs(...args));
  });

program
  .command('set-react-build')
  .description('Set the react build tool')
  .argument('[react build tool]', 'Use nextjs or vite for your frontend', 'vite')
  .action((...args: string[]) => {
    setConfig(...parseReactBuild(...args));
  });

program
  .command('start')
  .description('Start the react front end')
  .action(() => {
    startReact();
  });

program
  .command('build')
  .description('Build the react front end')
  .action(() => {
    buildReact();
  });

program.parse();
