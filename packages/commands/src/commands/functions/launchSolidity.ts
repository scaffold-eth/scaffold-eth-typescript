import fs from 'fs';

import chalk from 'chalk';
import shell from 'shelljs';

import { processUnknownArgs } from './processUnknownArgs';

import { printError } from '~~/commands/functions/printError';
import { load, printConfig } from '~~/helpers/configManager';

const createCommonGeneratedFolder = (): void => {
  const commonGeneratedPath = '../common/src/generated';
  const exists = fs.existsSync(commonGeneratedPath);

  if (!exists) {
    console.log(chalk.green('Creating folder' + commonGeneratedPath));
    fs.mkdirSync(commonGeneratedPath);
  }
};

export const compileSolidity = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  createCommonGeneratedFolder();

  if (config.build.solidityToolkit === 'hardhat') {
    const output = shell.exec('yarn workspace @scaffold-eth/solidity compile:hardhat' + passthroughArgs);
    printError(output, 'Could not compile');
  } else if (config.build.solidityToolkit === 'foundry') {
    const output = shell.exec('yarn workspace @scaffold-eth/solidity compile:foundry' + passthroughArgs);
    printError(output, 'Could not compile');
    shell.exec('yarn workspace @scaffold-eth/solidity compile:foundry:post ');
  } else {
    console.log(chalk.red('❌ Error! Invalid solidity toolkit in config!'));
  }

  const output = shell.exec('yarn workspace @scaffold-eth/common contracts:build');
  printError(output);
};

export const deploySolidity = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  createCommonGeneratedFolder();

  if (config.build.solidityToolkit === 'hardhat') {
    const output = shell.exec('yarn workspace @scaffold-eth/solidity deploy:hardhat' + passthroughArgs);
    printError(output, 'Could not deploy');
    shell.exec('yarn workspace @scaffold-eth/solidity deploy:hardhat:post');
  } else if (config.build.solidityToolkit === 'foundry') {
    const output = shell.exec('yarn workspace @scaffold-eth/solidity deploy:foundry' + passthroughArgs);
    printError(output, 'Could not deploy');
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
