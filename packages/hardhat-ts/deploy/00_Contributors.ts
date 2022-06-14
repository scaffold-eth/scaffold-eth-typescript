import { DeployFunction } from 'hardhat-deploy/types';
import { silent } from 'helpers/logging';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

export const CONTRIBUTORS_DEPLOYMENT = 'Contributors';

const deployContributors: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy(CONTRIBUTORS_DEPLOYMENT, {
    from: deployer,
    log: silent(),
  });
};
export default deployContributors;
deployContributors.tags = [CONTRIBUTORS_DEPLOYMENT];
