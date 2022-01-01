import React, { FC } from 'react';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { Contract } from 'ethers';
import { useContractLoader } from 'eth-hooks';
import { IScaffoldAppProviders } from '~~/app/main/hooks/useScaffoldAppProviders';
import { useEthersContext } from 'eth-hooks/context';
import { NETWORKS } from '~~/models/constants/networks';
import { useAppContracts } from '~~/config/contractFactory';
export interface IMainPageContractsProps {
  scaffoldAppProviders: IScaffoldAppProviders;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContractsProps> = (props) => {
  const ethersContext = useEthersContext();
  const daiContract = useAppContracts('DAI', 1);
  const yourContract = useAppContracts('YourContract', ethersContext.chainId);

  if (ethersContext.account == null) {
    return <></>;
  }

  return (
    <>
      <>
        {/* **********
          ❓ this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
        ********** */}
        <GenericContract
          contractName="YourContract"
          contract={yourContract}
          mainnetProvider={props.scaffoldAppProviders.mainnetProvider}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
          contractConfig={props.appContractConfig}
        />

        {/* **********
         * ❓ uncomment for a second contract:
         ********** */}
        {/*
          <GenericContract
            contractName="SecondContract"
            contract={contract={contractList?.['SecondContract']}
            mainnetProvider={props.appProviders.mainnetProvider}
            blockExplorer={props.appProviders.targetNetwork.blockExplorer}
            contractConfig={props.contractConfig}
          />
        */}

        {/***********
         *  ❓ Uncomment to display and interact with an external contract (DAI on mainnet):
         ********** */}
        {
          <GenericContract
            contractName="DAI"
            contract={daiContract}
            mainnetProvider={props.scaffoldAppProviders.mainnetProvider}
            blockExplorer={NETWORKS['mainnet'].blockExplorer}
            contractConfig={props.appContractConfig}
          />
        }
      </>
    </>
  );
};
