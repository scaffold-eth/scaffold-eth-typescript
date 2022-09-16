import chalk from 'chalk';
import shell from 'shelljs';

import { processUnknownArgs } from './processUnknownArgs';

import { load, printConfig } from '~~/helpers/configManager';

export const startReact = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn workspace @scaffold-eth/vite-app start' + passthroughArgs, {});
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
