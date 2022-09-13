import { existsSync } from 'fs';
import { watch } from 'node:fs/promises';

import chalk from 'chalk';
import { debounce } from 'debounce';
import { invariant } from 'ts-invariant';

import { deploySolidity, compileSolidity } from './launchSolidity';

import { load, printConfig } from '~~/helpers/configManager';

export const watchSolidity = (inputDebounceTime: number): void => {
  const config = load();
  printConfig(config);

  console.log(chalk.white('Watching solidity contracts...'));

  let debounceTime = inputDebounceTime * 1000 ?? 20000;
  if (debounceTime < 20000 || Number.isNaN(debounceTime)) debounceTime = 20000;

  const contactsDir = '../solidity-ts/contracts';
  const deployDir = '../solidity-ts/deploy';
  invariant(existsSync(contactsDir), 'directory does not exist' + contactsDir);
  invariant(existsSync(deployDir), 'directory does not exist' + deployDir);

  const deploy = debounce(() => {
    deploySolidity([]);
  }, debounceTime);

  const compile = debounce(() => {
    compileSolidity([]);
    deploy();
  }, debounceTime);

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
