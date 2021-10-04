import React, { FC, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import {
  ExternalProvider,
  getNetwork,
  JsonRpcFetchFunc,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';

import '~~/styles/main-page.css';
import { Alert } from 'antd';
import {
  useUserAddress,
  useGasPrice,
  useContractLoader,
  useContractReader,
  useBalance,
  useOnRepetition,
  useGetUserFromProviders,
} from 'eth-hooks';
import { useDexEthPrice } from 'eth-hooks/dapps';

import { GenericContract } from 'eth-components/ant/generic-contract';
import { Hints, Subgraph } from '~~/components/routes';
import { ExampleUI } from '~~/components/routes/exampleui/ExampleUI';
import { transactor } from 'eth-components/functions';

import { ethers } from 'ethers';

import { TEthersProvider, TEthersUser } from 'eth-hooks/models';
import { useEventListener } from 'eth-hooks';
import { MainPageMenu } from './components/MainPageMenu';
import { MainPageContracts } from './components/MainPageContracts';
import { MainPageFooter } from './components/MainPageFooter';
import { useScaffoldContractConfig } from '~~/components/routes/main/hooks/useScaffoldContractConfig';
import { EthComponentsContext } from 'eth-components/models';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { useBurnerFallback } from '~~/components/routes/main/hooks/useBurnerFallback';
import { getFaucetAvailable } from '../../common/FaucetHintButton';
import { MainPageHeader } from '~~/components/routes/main/components/MainPageHeader';
import { useScaffoldHooks } from './hooks/useScaffoldHooks';
import { getNetworkInfo } from '~~/helpers/getNetworkInfo';
import { subgraphUri } from '~~/config/subgraph';

export const DEBUG = false;

export const MainPage: FC = (props) => {
  const context = useContext(EthComponentsContext);

  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------

  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers User from current providers
  let currentEthersUser: TEthersUser = useGetUserFromProviders(scaffoldAppProviders.currentProvider);
  // if no user is found use a burner wallet on localhost as fallback
  currentEthersUser = useBurnerFallback(scaffoldAppProviders, currentEthersUser);

  // -----------------------------
  // Contracts
  // -----------------------------

  // ⚙ contract config
  // get the contracts configuration for the app
  const contractsConfig = useScaffoldContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(contractsConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(contractsConfig, currentEthersUser?.signer);

  // EXTERNAL CONTRACT EXAMPLE:
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(contractsConfig);

  // -----------------------------
  // current contract and listners
  // -----------------------------

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader<string>(readContracts, { contractName: 'YourContract', functionName: 'purpose' });

  // 📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts?.['YourContract'], 'SetPurpose', 1);

  // -----------------------------
  // Hooks
  // -----------------------------
  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const price = useDexEthPrice(scaffoldAppProviders.targetNetwork, scaffoldAppProviders.mainnetProvider);

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const gasPrice = useGasPrice(
    currentEthersUser.providerNetwork?.chainId,
    'fast',
    getNetworkInfo(currentEthersUser.providerNetwork?.chainId)
  );

  // 💰 this hook will get your balance
  const yourCurrentBalance = useBalance(currentEthersUser.address ?? '');

  // -----------------------------
  // 🎉 Console logs & More hook examples:  Check out this to see how to get
  // -----------------------------
  useScaffoldHooks(scaffoldAppProviders, currentEthersUser, readContracts, writeContracts, mainnetContracts);

  // The transactor wraps transactions and provides notificiations
  const tx = transactor(context, currentEthersUser?.signer, gasPrice);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  // Faucet Tx can be used to send funds from the faucet
  let faucetAvailable = getFaucetAvailable(scaffoldAppProviders, currentEthersUser);

  console.log(scaffoldAppProviders);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name.  Your account is on the right */}
      <MainPageHeader
        currentEthersUser={currentEthersUser}
        scaffoldAppProviders={scaffoldAppProviders}
        price={price}
        gasPrice={gasPrice}
      />
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />
        <Switch>
          <Route exact path="/">
            {currentEthersUser != null && (
              <>
                {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
              */}
                <MainPageContracts
                  appProviders={scaffoldAppProviders}
                  mainnetContracts={{}}
                  currentEthersUser={currentEthersUser}
                  contractConfig={contractsConfig}
                />
              </>
            )}
          </Route>
          <Route path="/hints">
            <Hints
              address={currentEthersUser?.address ?? ''}
              yourCurrentBalance={yourCurrentBalance}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
              address={currentEthersUser?.address ?? ''}
              userSigner={currentEthersUser?.signer}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
              currentProvider={currentEthersUser?.provider}
              yourCurrentBalance={yourCurrentBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={purpose ?? ''}
              setPurposeEvents={setPurposeEvents}
            />
          </Route>
          <Route path="/mainnetdai">
            {currentEthersUser?.signer != null && (
              <GenericContract
                contractName="DAI"
                customContract={mainnetContracts?.contracts?.DAI as ethers.Contract | undefined}
                currentEthersUser={currentEthersUser}
                mainnetProvider={scaffoldAppProviders.mainnetProvider}
                blockExplorer="https://etherscan.io/"
                contractConfig={contractsConfig}
              />
            )}
          </Route>
          <Route path="/subgraph">
            <Subgraph
              subgraphUri={subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <MainPageFooter
        scaffoldAppProviders={scaffoldAppProviders}
        currentEthersUser={currentEthersUser}
        price={price}
        gasPrice={gasPrice}
        faucetAvailable={faucetAvailable}
      />
    </div>
  );
};

export default MainPage;
