import chalk from 'chalk';
import shell from 'shelljs';

import { processUnknownArgs } from '~~/commands/functions/processUnknownArgs';
import { load, printConfig } from '~~/helpers/configManager';

export const testSolidity = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);
  if (config.build.solidityToolkit === 'hardhat') {
    shell.exec('yarn workspace @scaffold-eth/solidity hardhat test' + passthroughArgs);
  } else if (config.build.solidityToolkit === 'foundry') {
    shell.exec('yarn workspace @scaffold-eth/solidity exec forge test' + passthroughArgs);
  } else {
    console.log(chalk.red('❌ Error! Invalid solidity toolkit in config!'));
  }
};
