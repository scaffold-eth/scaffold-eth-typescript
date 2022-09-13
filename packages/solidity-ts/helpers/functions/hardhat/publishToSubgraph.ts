import fs from 'fs';

import chalk from 'chalk';

import { hardhatDeploymentsDir } from '~helpers/constants/toolkitPaths';

const graphDir = '../subgraph';

const publishContract = (contractName: string, networkName: string): boolean => {
  try {
    const contract = fs.readFileSync(`${hardhatDeploymentsDir}/${networkName}/${contractName}.json`).toString();
    const contractJson: { address: string; abi: [] } = JSON.parse(contract);
    const graphConfigPath = `${graphDir}/config/config.json`;
    let graphConfigStr = '{}';
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfigStr = fs.readFileSync(graphConfigPath).toString() as any;
      }
    } catch (e) {
      console.log(e);
    }

    const graphConfig = JSON.parse(graphConfigStr);
    graphConfig[`${networkName}_${contractName}Address`] = contractJson.address;

    const folderPath = graphConfigPath.replace('/config.json', '');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2));
    if (!fs.existsSync(`${graphDir}/abis`)) fs.mkdirSync(`${graphDir}/abis`);
    fs.writeFileSync(`${graphDir}/abis/${networkName}_${contractName}.json`, JSON.stringify(contractJson.abi, null, 2));

    console.log(' 📠 Published ' + chalk.green(contractName) + ' to the frontend');

    return true;
  } catch (e) {
    console.log('Failed to publish ' + chalk.red(contractName) + ' to the subgraph.');
    console.log(e);
    return false;
  }
};
export const hardhatPublishToSubgraph = (): void => {
  console.log(chalk.white('Running Post Deploy: publish contracts to subgraph...'));

  const deploymentSubdirs = fs.readdirSync(hardhatDeploymentsDir);
  deploymentSubdirs.forEach(function (directory) {
    const files = fs.readdirSync(`${hardhatDeploymentsDir}/${directory}`);
    files.forEach(function (file) {
      if (file.includes('.json')) {
        const contractName = file.replace('.json', '');
        publishContract(contractName, directory);
      }
    });
  });
  console.log(chalk.green('✔️ Published contracts to the subgraph package! '));
};
