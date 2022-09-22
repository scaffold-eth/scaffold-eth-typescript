import chalk from 'chalk';
import shell from 'shelljs';

export const printError = (output: shell.ShellString, additionalMsg: string = ''): void => {
  if (output.stderr.includes('Error HH')) {
    console.log(chalk.red('Error running commmand! ' + additionalMsg));
    console.log();
  }
};
