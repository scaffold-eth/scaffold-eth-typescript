import React, { FC, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '~~/styles/main-page.css';
import { useGasPrice, useContractLoader, useContractReader, useBalance } from 'eth-hooks';
import { useDexEthPrice } from 'eth-hooks/dapps';

import { GenericContract } from 'eth-components/ant/generic-contract';
import { Hints, Subgraph, ExampleUI } from '~~/components/routes';
import { transactor } from 'eth-components/functions';

import { ethers } from 'ethers';

import { useEventListener } from 'eth-hooks';
import { MainPageMenu, MainPageContracts, MainPageFooter, MainPageHeader } from './components/';
import { useAppContractConfig } from '~~/components/routes/main/hooks/useAppContractConfig';
import { EthComponentsContext } from 'eth-components/models';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { useBurnerFallback } from '~~/components/routes/main/hooks/useBurnerFallback';
import { getFaucetAvailable } from '../../common/FaucetHintButton';
import { useScaffoldHooks } from './hooks/useScaffoldHooks';
import { getNetworkInfo } from '~~/helpers/getNetworkInfo';
import { subgraphUri } from '~~/config/subgraph';
import { useEthersContext } from 'eth-hooks/context';
import { NETWORKS } from '~~/models/constants/networks';
import { mainnetProvider } from '~~/config/providersConfig';

export const DEBUG = false;

export const MainPage: FC = (props) => {
  const context = useContext(EthComponentsContext);

  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------

  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersContext = useEthersContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, true);

  // -----------------------------
  // Contracts
  // -----------------------------

  // ⚙ contract config
  // get the contracts configuration for the app
  const appContractConfig = useAppContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(appContractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(appContractConfig, ethersContext?.signer);

  // EXTERNAL CONTRACT EXAMPLE:
  // If you want to bring in the mainnet DAI contract it would look like:
  // you need to pass the appropriate provider (readonly) or signer (write)
  const mainnetContracts = useContractLoader(appContractConfig, mainnetProvider, NETWORKS['mainnet'].chainId);

  // -----------------------------
  // current contract and listners
  // -----------------------------

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader<string>(readContracts?.['YourContract'], {
    contractName: 'YourContract',
    functionName: 'purpose',
  });

  // 📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts?.['YourContract'], 'SetPurpose', 1);

  // -----------------------------
  // Hooks
  // -----------------------------
  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const price = useDexEthPrice(scaffoldAppProviders.mainnetProvider, scaffoldAppProviders.targetNetwork);

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const gasPrice = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));

  // 💰 this hook will get your balance
  const yourCurrentBalance = useBalance(ethersContext.account ?? '');

  // -----------------------------
  // 🎉 Console logs & More hook examples:  Check out this to see how to get
  // -----------------------------
  useScaffoldHooks(scaffoldAppProviders, readContracts, writeContracts, mainnetContracts);

  // The transactor wraps transactions and provides notificiations
  const tx = transactor(context, ethersContext?.signer, gasPrice);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  // Faucet Tx can be used to send funds from the faucet
  let faucetAvailable = getFaucetAvailable(scaffoldAppProviders, ethersContext);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name.  Your account is on the right */}
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={price} gasPrice={gasPrice} />
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />
        <Switch>
          <Route exact path="/">
            {ethersContext.account != null && (
              <>
                {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
              */}
                <MainPageContracts
                  scaffoldAppProviders={scaffoldAppProviders}
                  mainnetContracts={mainnetContracts}
                  appContractConfig={appContractConfig}
                />
              </>
            )}
          </Route>
          <Route path="/hints">
            <Hints
              address={ethersContext?.account ?? ''}
              yourCurrentBalance={yourCurrentBalance}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
              address={ethersContext?.account ?? ''}
              userSigner={ethersContext?.signer}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
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
            {mainnetProvider != null && (
              <GenericContract
                contractName="DAI"
                contract={mainnetContracts?.['DAI']}
                mainnetProvider={scaffoldAppProviders.mainnetProvider}
                blockExplorer={NETWORKS['mainnet'].blockExplorer}
                contractConfig={appContractConfig}
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
        price={price}
        gasPrice={gasPrice}
        faucetAvailable={faucetAvailable}
      />
    </div>
  );
};

export default MainPage;
