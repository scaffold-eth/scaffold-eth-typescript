import chalk from 'chalk'
import { makeNodeDisklet } from 'disklet'
import { Contract } from 'ethers'
import { DeployOptions, DeployResult, Libraries } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

interface CommonDeployArgs extends Omit<DeployOptions, 'from'> {
  hre: HardhatRuntimeEnvironment
  name?: string
  libraries?: Libraries
  log?: boolean
  indent?: number
}

export interface DeployArgs extends CommonDeployArgs {
  contract: string
  args?: any[]
  skipIfAlreadyDeployed?: boolean
  mock?: boolean
}

type DeployedContract<C extends Contract> = C & { deployResult: DeployResult }

export const deploy = async <C extends Contract>(
  args: DeployArgs
): Promise<DeployedContract<C>> => {
  const { hre, skipIfAlreadyDeployed = true, indent = 1 } = args
  const {
    deployments: { deploy, getOrNull },
    getNamedAccounts,
  } = hre

  const { deployer } = await getNamedAccounts()

  // If marked as mock, prepend "Mock" to the contract name
  const contractName = `${args.contract}${args.mock ? 'Mock' : ''}`
  const contractDeployName = args.name ?? args.contract

  const existingContract = await getOrNull(contractDeployName)
  let contractAddress: string
  let result: DeployResult

  if (!existingContract || (existingContract && !skipIfAlreadyDeployed)) {
    result = await deploy(contractDeployName, {
      ...args,
      contract: contractName,
      from: deployer,
    })
    contractAddress = result.address
  } else {
    result = { ...existingContract, newlyDeployed: false }
    contractAddress = existingContract.address
  }

  await onDeployResult({
    result,
    contract: contractName,
    name: contractDeployName,
    hre,
    indent,
  })

  const contract = (await hre.contracts.get(contractDeployName, {
    at: contractAddress,
  })) as DeployedContract<C>
  contract.deployResult = result
  return contract
}

export interface DiamondExecuteArgs<F, A> {
  methodName: F
  args: A
}

type FacetConfig = Omit<DeployArgs, 'hre'>
export type Facets = Array<string | FacetConfig>

export interface DeployDiamondArgs<
  C extends Contract,
  F = string | undefined,
  A = F extends keyof C['functions'] ? Parameters<C[F]> : undefined
> extends CommonDeployArgs {
  name: string
  facets: Facets
  owner?: string
  execute?: F extends keyof C['functions']
    ? DiamondExecuteArgs<F, A>
    : undefined
}

export const deployDiamond = async <
  C extends Contract,
  F = string | undefined,
  A = F extends keyof C['functions'] ? Parameters<C[F]> : undefined
>(
  args: DeployDiamondArgs<C, F, A>
): Promise<C> => {
  const { hre, indent = 1 } = args
  const {
    deployments: { diamond },
    getNamedAccounts,
    ethers,
    log,
  } = hre

  const { deployer } = await getNamedAccounts()

  const contractDisplayName = chalk.green.bold.underline(args.name)
  log(`Deploying Diamond facets for ${contractDisplayName}`, {
    star: true,
    indent,
  })

  for (let config of args.facets) {
    if (typeof config === 'string') {
      config = { contract: config }
    }

    const { deployResult } = await deploy({
      ...config,
      indent: indent + 1,
      hre,
    })
    if (deployResult.artifactName) {
      config.contract = deployResult.artifactName
    }
  }

  const result = await diamond.deploy(args.name, {
    owner: args.owner ?? deployer,
    libraries: args.libraries,
    facets: args.facets,
    // @ts-expect-error fix type
    execute: args.execute,
    from: deployer,
    log: false,
  })

  await onDeployResult({
    result,
    contract: 'Diamond',
    name: args.name,
    hre,
    indent: indent + 1,
  })
  log('')

  return await ethers.getContractAt(result.abi, result.address)
}

interface DeployResultArgs {
  result: DeployResult
  hre: HardhatRuntimeEnvironment
  contract: string
  name: string
  indent?: number
}

const onDeployResult = async (args: DeployResultArgs): Promise<void> => {
  const { result, hre, contract, name, indent = 1 } = args

  let displayName = name
  if (contract !== name) {
    displayName = `${displayName} (${chalk.bold.italic(contract)})`
  }
  if (result.artifactName && result.artifactName !== contract) {
    displayName = `${displayName} (${chalk.bold.italic(result.artifactName)})`
  }

  hre.log(`${displayName}:`, {
    indent,
    star: true,
    nl: false,
  })

  if (result.newlyDeployed) {
    const gas = chalk.cyan(`${result.receipt!.gasUsed} gas`)
    hre.log(
      ` ${chalk.green('new')} ${result.address} ${
        result.receipt ? 'with ' + gas : ''
      }`
    )

    await saveDeploymentBlock(hre.network.name, result.receipt!.blockNumber)
  } else {
    hre.log(` ${chalk.yellow('reusing')} ${result.address}`)
  }
}

const saveDeploymentBlock = async (
  networkName: string,
  block: number
): Promise<void> => {
  if (networkName === 'hardhat') return

  const disklet = makeNodeDisklet('.')

  const deploymentBlockPath = `deployments/${networkName}/.latestDeploymentBlock`
  const lastDeployment = await disklet
    .getText(deploymentBlockPath)
    .catch(() => {})
  if (!lastDeployment || block > parseInt(lastDeployment)) {
    await disklet.setText(deploymentBlockPath, block.toString())
  }
}
