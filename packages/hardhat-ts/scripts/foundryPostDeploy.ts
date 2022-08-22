import { readFile, writeFile } from 'node:fs/promises';

import { invariant } from 'ts-invariant';

import { readAllChildDirs, readChildFiles } from '../helpers/functions/fileHelper';

// import { validateBroadcastFile } from '~common/functions/validateBroadcastCollection';

const broadcastDir = './generated/foundry/broadcast/';
const deployScriptName = 'DeployContracts.sol';
const deployJsonDir = broadcastDir + deployScriptName + '/';
const latestBroadcastFileFilter = /run-latest\.json$/;
const destination = '../common/src/generated/foundry_contracts.json';

export const foundryPostDeploy = async (): Promise<void> => {
  const data = await getAllChainIdBroadcastJsons(deployJsonDir);
  // validateBroadcastFile(data);
  await writeFile(destination, JSON.stringify(data));
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

// run script
foundryPostDeploy().catch(console.error);
