interface IForgeScriptsRequiredArgs {
  rpcUrl: string;
  sender: string;
}

export const foundryDeploy = ({ rpcUrl, sender }: IForgeScriptsRequiredArgs, forgeScriptsOptionalARgs: Record<string, string>): void => {
  const cmd = `forge script deploy/foundry-deploy/DeployContracts.sol:DeployContracts --broadcast --rpc-url ${rpcUrl} --json`;
};
