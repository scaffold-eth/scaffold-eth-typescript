import chalk from 'chalk';
import shell from 'shelljs';

import { processUnknownArgs } from './processUnknownArgs';

import { load, printConfig } from '~~/helpers/configManager';

export const compileSolidity = (args: string[]): void => {
  const config = load();
  printConfig(config);
  // console.log(args, options);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.solidityToolkit === 'hardhat') {
    shell.exec('yarn workspace @scaffold-eth/solidity compile:hardhat' + passthroughArgs);
  } else if (config.build.solidityToolkit === 'foundry') {
    shell.exec('yarn workspace @scaffold-eth/solidity compile:foundry' + passthroughArgs);
    shell.exec('yarn workspace @scaffold-eth/solidity compile:foundry:post ');
  } else {
    console.log(chalk.red('❌ Error! Invalid solidity toolkit in config!'));
  }

  shell.exec('yarn workspace @scaffold-eth/common contracts:build');
};

export const deploySolidity = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.solidityToolkit === 'hardhat') {
    shell.exec('yarn workspace @scaffold-eth/solidity deploy:hardhat' + passthroughArgs);
    shell.exec('yarn workspace @scaffold-eth/solidity deploy:hardhat:post');
  } else if (config.build.solidityToolkit === 'foundry') {
    shell.exec('yarn workspace @scaffold-eth/solidity deploy:foundry' + passthroughArgs);
    shell.exec('yarn workspace @scaffold-eth/solidity deploy:foundry:post');
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};

export const startChain = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);
  console.log(passthroughArgs);

  if (config.build.solidityToolkit === 'hardhat') {
    shell.exec('yarn workspace @scaffold-eth/solidity chain:hardhat' + passthroughArgs);
  } else if (config.build.solidityToolkit === 'foundry') {
    shell.exec('yarn workspace @scaffold-eth/solidity chain:foundry' + passthroughArgs);
  } else {
    console.log(chalk.red('❌ Error! Invalid solidity toolkit in config!'));
  }
};
