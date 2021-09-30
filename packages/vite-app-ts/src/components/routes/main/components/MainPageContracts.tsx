import React, { FC } from 'react';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { Contract } from 'ethers';
import { TEthersUser } from 'eth-hooks/models';
import { TContractConfig } from 'eth-hooks';
import { IScaffoldProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

interface IMainPageContracts {
  appProviders: IScaffoldProviders;
  currentEthersUser: TEthersUser;
  mainnetContracts: Record<string, Contract>;
  blockExplorerUrl: string;
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
  return (
    <>
      {/*
        🎛 this scaffolding is full of commonly used components
        this <Contract/> component will automatically parse your ABI
        and give you a form to interact with it locally
      */}
      {props.currentEthersUser?.signer != null && (
        <>
          <GenericContract
            contractName="YourContract"
            currentEthersUser={props.currentEthersUser}
            mainnetProvider={props.appProviders.mainnetProvider}
            blockExplorer={props.blockExplorerUrl}
            contractConfig={props.contractConfig}
          />

          {/* uncomment for a second contract: 
        <GenericContract
          name="SecondContract"
          currentProviderAndSigner={props.currentProviderAndSigner}
          blockExplorer={props.blockExplorerUrl}
          config={props.config}
        />
        */}

          {/* Uncomment to display and interact with an external contract (DAI on mainnet): 
        <GenericContract
          name="DAI"
          customContract={props.mainnetContracts?.['DAI']}
          currentProviderAndSigner={props.currentProviderAndSigner}
          provider={props.mainnetProvider}
          address={props.userAddress}
          blockExplorer={props.blockExplorerUrl}
          config={props.config}
          chainId={props.mainnetProvider.chainId}
        />
        */}
        </>
      )}
    </>
  );
};
