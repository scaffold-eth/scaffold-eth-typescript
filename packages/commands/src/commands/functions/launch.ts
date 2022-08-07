import { Command } from 'commander';
import { load } from '~~/helpers/configManager';
import shell from 'shelljs';
import chalk from 'chalk';

export const startReact = () => {
  const config = load();

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn start:vite');
  } else if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn start:nextjs');
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};

export const buildProject = () => {
  const config = load();

  if (config.build.reactBuild === 'vite') {
    shell.exec('yarn start:vite');
  } else if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn start:nextjs');
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};
