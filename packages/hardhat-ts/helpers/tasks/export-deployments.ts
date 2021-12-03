import fs from 'fs'

import chalk from 'chalk'
import { Deployment } from 'hardhat-deploy/dist/types'
import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

task(
  'export:deployments',
  'Export contract deployments for react-app and subgraph packages'
).setAction(async (args, hre) => {
  await publishReactApp(hre)
  await publishSubgraph(hre)
})

const publishReactApp = async (
  hre: HardhatRuntimeEnvironment
): Promise<void> => {
  await hre.run('export', {
    exportAll: '../react-app/src/contracts/hardhat_contracts.json',
  })
  console.log('✅  Published contracts to the react-app package.')
}

const publishSubgraph = async (
  hre: HardhatRuntimeEnvironment
): Promise<void> => {
  const deployments = await hre.deployments.all()
  for (const contractName in deployments) {
    const deployment = deployments[contractName]
    await writeSubgraphContract(hre, contractName, deployment, hre.network.name)
  }
  console.log('✅  Published contracts to the subgraph package.')
}

const graphDir = '../subgraph'
async function writeSubgraphContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  deployment: Deployment,
  networkName: string
): Promise<boolean> {
  try {
    const deployment = await hre.deployments.get(contractName)
    const graphConfigPath = `${graphDir}/config/config.json`
    let graphConfigStr = '{}'
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfigStr = fs.readFileSync(graphConfigPath).toString()
      }
    } catch (e) {
      console.log(e)
    }

    const graphConfig = JSON.parse(graphConfigStr)
    graphConfig[`${networkName}_${contractName}Address`] = deployment.address

    const folderPath = graphConfigPath.replace('/config.json', '')
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2))
    if (!fs.existsSync(`${graphDir}/abis`)) fs.mkdirSync(`${graphDir}/abis`)
    fs.writeFileSync(
      `${graphDir}/abis/${networkName}_${contractName}.json`,
      JSON.stringify(deployment.abi, null, 2)
    )

    return true
  } catch (e) {
    console.log(`Failed to publish ${chalk.red(contractName)} to the subgraph.`)
    console.log(e)
    return false
  }
}
