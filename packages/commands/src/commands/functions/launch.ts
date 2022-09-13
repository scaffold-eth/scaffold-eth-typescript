import chalk from 'chalk';
import shell from 'shelljs';

import { load, printConfig } from '~~/helpers/configManager';

const processUnknownArgs = (args: string[] | string): string => {
  if (Array.isArray(args) && args.join != null) {
    return ' ' + args.join(' ');
  } else if (typeof args === 'string') {
    return ` ${args}`;
  }

  return '';
};

export const startReact = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn workspace @scaffold-eth/vite-app start' + passthroughArgs);
  } else if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn workspace @scaffold-eth/nextjs-app dev' + passthroughArgs);
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};

export const buildReact = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn workspace @scaffold-eth/vite-app build' + passthroughArgs);
  } else if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn workspace @scaffold-eth/nextjs-app build' + passthroughArgs);
  } else {
    console.log(chalk.red('❌ Error! Invalid solidity toolkit in config!'));
  }
};

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
  // console.log(args, options);
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
