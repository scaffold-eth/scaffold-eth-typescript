import { Command } from 'commander';

import {
  createConfig,
  parseCreateConfigArgs,
  setConfig,
  parseReactBuild,
  parseSolidityToolkit,
  parseNetwork,
} from './functions/config';

import { buildReact, startReact } from '~~/commands/functions/launchReact';
import { compileSolidity, deploySolidity, startChain } from '~~/commands/functions/launchSolidity';
import { testSolidity } from '~~/commands/functions/launchTests';
import { watchSolidity } from '~~/commands/functions/watchSolidity';

const program = new Command();

program.name('scaffold').description('Scaffold-Eth-Typescript Commands');

/** ********************************* */
/*  Config Commands            */

program
  .command('reset-config')
  .description('Create scaffold.config.json')
  .action(() => {
    createConfig(...parseCreateConfigArgs('hardhat', 'vite', 'localhost', 'localhost'));
  });

program
  .command('set-config')
  .description('Set scaffold.config.json file')
  .argument('<solidity>', ':  Solidity tooklit:  use `hardhat` or `foundry`')
  .argument('<react>', 'React frontend: use nextjs or vite for your frontend')
  .argument('<targetNetwork>', ':  An network your toolkit should target.  (e.g. `localhost` or "localhost, mainnet")')
  .argument('<availableNetworks>', ':  An array of networks to target. (e.g. `localhost` or "localhost, mainnet")')
  .action((...args: string[]) => {
    createConfig(...parseCreateConfigArgs(...args));
  });

program
  .command('set-react')
  .description('Set the react build tool')
  .argument('[react build tool]', 'Use nextjs or vite for your frontend', 'vite')
  .action((...args: string[]) => {
    setConfig(...parseReactBuild(...args));
  });

program
  .command('set-solidity')
  .description('Set the solidity toolkit')
  .argument('[react build tool]', 'Use foundry or hardhat for your frontend', 'hardhat')
  .action((...args: string[]) => {
    setConfig(...parseSolidityToolkit(...args));
  });

program
  .command('set-network')
  .description('Set your networks')
  .argument('<targetNetwork>', ':  An network your toolkit should target.  (e.g. `localhost` or "localhost, mainnet")')
  .argument('<availableNetworks>', ':  An array of networks to target. (e.g. `localhost` or "localhost, mainnet")')
  .action((...args: string[]) => {
    setConfig(...parseNetwork(...args));
  });

/** ********************************* */
/*  React Build Commands            */

program
  .command('start')
  .description('Start the react front end')
  .argument('[args...]')
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .action((args: string[]) => {
    startReact(args);
  });

program
  .command('build')
  .description('Build the react front end')
  .argument('[args...]')
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .action((args: string[]) => {
    buildReact(args);
  });

/** ********************************* */
/*  Solidity commands            */

program
  .command('deploy')
  .description('Deploy your contracts')
  .argument('[args...]')
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .action((args: string[]) => {
    deploySolidity(args);
  });

program
  .command('compile')
  .description('Compile the solidity contracts')
  .argument('[args...]')
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .action((args: string[]) => {
    compileSolidity(args);
  });

program
  .command('chain')
  .description('Start a local ethereum node, hardhat or anvil')
  .argument('[args...]')
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .action((args: string[]) => {
    startChain(args);
  });

program
  .command('test')
  .description('Run solidity tests')
  .argument('[args...]')
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .action((args: string[]) => {
    testSolidity(args);
  });

program
  .command('watch')
  .description('Watch and build contracts automatically')
  .argument('[time]', 'Time (seconds) after which a build should be triggered.  Minimum is 10s, max 10min')
  .action((throttleTimeStr: string) => {
    const throttleTime = parseInt(throttleTimeStr);
    watchSolidity(throttleTime);
  });

program.parse();
