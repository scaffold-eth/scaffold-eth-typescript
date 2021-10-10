import React, { FC } from 'react';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { Contract } from 'ethers';
import { TContractConfig, useContractLoader } from 'eth-hooks';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { useEthersContext } from 'eth-hooks/context';

interface IMainPageContracts {
  appProviders: IScaffoldAppProviders;
  mainnetContracts: Record<string, Contract>;
  contractConfig: TContractConfig;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContracts> = (props) => {
  const ethersContext = useEthersContext();
  const contractList = useContractLoader(props.contractConfig, undefined);

  return (
    <>
      <>
        {/* **********
          ❓ this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
        ********** */}
        {/* <GenericContract
          contractName="YourContract"
          contract={contractList?.['YourContract']}
          mainnetProvider={props.appProviders.mainnetProvider}
          blockExplorer={props.appProviders.targetNetwork.blockExplorer}
          contractConfig={props.contractConfig}
        /> */}

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
        <GenericContract
          contractName="DAI"
          contract={props.mainnetContracts?.['DAI']}
          mainnetProvider={props.appProviders.mainnetProvider}
          blockExplorer={props.appProviders.targetNetwork.blockExplorer}
          contractConfig={props.contractConfig}
        />
      </>
    </>
  );
};
