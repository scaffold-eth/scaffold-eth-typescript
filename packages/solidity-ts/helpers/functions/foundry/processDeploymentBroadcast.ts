import { readFile, writeFile } from 'node:fs/promises';

import chalk from 'chalk';
import { invariant } from 'ts-invariant';

import { readAllChildDirs, readChildFiles } from '../fileHelper';

import { commonGenerated, foundryBroadcastDir, foundryDeployScriptName } from '~helpers/constants/toolkitPaths';

// import { validateBroadcastFile } from '~common/functions/validateBroadcastCollection';

const deployJsonDir = foundryBroadcastDir + foundryDeployScriptName + '/';
const latestBroadcastFileFilter = /run-latest\.json$/;
const destination = `${commonGenerated}foundry_contracts.json`;

export const foundryProcessDeploymentBroadcast = async (): Promise<void> => {
  console.log(chalk.white('🏁 Running Foundry post deploy...'));
  const data = await getAllChainIdBroadcastJsons(deployJsonDir);
  // validateBroadcastFile(data);
  await writeFile(destination, JSON.stringify(data));
  console.log(chalk.green('✔️ Done'));
};

const getAllChainIdBroadcastJsons = async (dirPath: string): Promise<{ [chainId: string]: string }> => {
  const allChainIdFolders = await readAllChildDirs(dirPath);

  // key: chainId, value: json file path
  const broadcastByChainId: Record<string, string> = {};

  for (const chainIdPath of allChainIdFolders) {
    const chainIdJsonFile = await readChildFiles(chainIdPath, latestBroadcastFileFilter);
    if (chainIdJsonFile.length > 0) {
      invariant(chainIdPath.split('/').pop() !== null, 'chainId was not found');
      const chainId = parseInt(chainIdPath.split('/').pop() as string);
      const data = JSON.parse(await readFile(chainIdJsonFile[0], { encoding: 'utf8' }));
      broadcastByChainId[chainId] = data;
    }
  }

  return broadcastByChainId;
};
