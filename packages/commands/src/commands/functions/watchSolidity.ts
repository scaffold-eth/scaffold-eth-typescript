import { existsSync } from 'fs';
import { watch } from 'node:fs/promises';

import chalk from 'chalk';
import { throttle } from 'throttle-debounce';
import { invariant } from 'ts-invariant';

import { deploySolidity, compileSolidity } from './launchSolidity';

import { load, printConfig } from '~~/helpers/configManager';

export const watchSolidity = (minWatchTime: number): void => {
  const config = load();
  printConfig(config);
  let throttleTime = minWatchTime ?? 20;
  if (Number.isNaN(throttleTime)) throttleTime = 20;
  if (throttleTime < 10) throttleTime = 10;
  if (throttleTime >= 600) throttleTime = 600;

  console.log(chalk.white('Watching solidity contracts for changes...', `minWatchTime: ${throttleTime} (s)`));

  const contactsDir = '../solidity-ts/contracts';
  const deployDir = '../solidity-ts/deploy';
  invariant(existsSync(contactsDir), 'directory does not exist' + contactsDir);
  invariant(existsSync(deployDir), 'directory does not exist' + deployDir);

  const deploy = throttle(
    throttleTime * 1000,
    (): void => {
      deploySolidity([]);
      console.log();
      console.log(chalk.white('-------------------------------'));
      console.log(chalk.white('Watching solidity contracts for changes...', `minWatchTime: ${throttleTime} (s)`));
    },
    { noLeading: true }
  );

  const compile = throttle(
    throttleTime * 1000,
    () => {
      compileSolidity([]);
      deploy();
    },
    { noLeading: true }
  );

  void (async (): Promise<void> => {
    try {
      const watcher = watch(contactsDir, { recursive: true });
      for await (const event of watcher) {
        console.log(event);
        compile();
      }
    } catch (err) {
      throw err;
    }
  })();

  void (async (): Promise<void> => {
    try {
      const watcher = watch(deployDir, { recursive: true });
      for await (const event of watcher) {
        console.log(event);
        deploy();
      }
    } catch (err) {
      throw err;
    }
  })();
};
