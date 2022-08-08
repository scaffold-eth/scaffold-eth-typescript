import { Command } from 'commander';
import { load, printConfig } from '~~/helpers/configManager';
import shell from 'shelljs';
import chalk from 'chalk';

export const startReact = () => {
  const config = load();
  printConfig(config);

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn workspace @scaffold-eth/vite-app start');
  } else if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn workspace @scaffold-eth/nextjs-app start');
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};

export const buildReact = () => {
  const config = load();
  printConfig(config);

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn workspace @scaffold-eth/vite-app build');
  } else if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn workspace @scaffold-eth/nextjs-app build');
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};
