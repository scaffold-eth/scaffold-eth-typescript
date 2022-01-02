import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '~~/styles/main-page.css';
import { useContractReader, useBalance, useGetEthersAdaptorFromProviders } from 'eth-hooks';
import { useDexEthPrice } from 'eth-hooks/dapps';

import { GenericContract } from 'eth-components/ant/generic-contract';
import { Hints, Subgraph, ExampleUI } from '~~/app/pages';

import { useEventListener } from 'eth-hooks';
import { MainPageMenu, MainPageContracts, MainPageFooter, MainPageHeader } from './app/main/components';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/app/main/hooks/useScaffoldAppProviders';
import { useBurnerFallback } from '~~/app/main/hooks/useBurnerFallback';
import { useScaffoldHooksExamples as useScaffoldHooksExamples } from './app/main/hooks/useScaffoldHooksExamples';
import { useEthersContext } from 'eth-hooks/context';
import { NETWORKS } from '~~/models/constants/networks';
import { mainnetProvider } from '~~/config/providersConfig';
import {
  useAppContracts,
  useAppContractsActions,
  useConnectAppContracts,
  useLoadAppContracts,
} from '~~/config/contractContext';
import { asEthersAdaptor } from 'eth-hooks/functions';

export const DEBUG = false;

export const Main: FC = () => {
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
  // Load Contracts
  // -----------------------------
  // 🛻 load contracts
  useLoadAppContracts();
  // 🏭 connect to contracts for mainnet network & signer
  const mainnetAdaptor = useGetEthersAdaptorFromProviders(mainnetProvider);
  useConnectAppContracts(mainnetAdaptor);
  // 🏭 connec to  contracts for current network & signer
  useConnectAppContracts(asEthersAdaptor(ethersContext));

  // -----------------------------
  // examples on how to get contracts
  // -----------------------------
  // init contracts
  const yourContract = useAppContracts('YourContract', scaffoldAppProviders.targetNetwork.chainId);
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(yourContract, yourContract?.purpose);

  // 📟 Listen for broadcast events
  const [setPurposeEvents] = useEventListener(yourContract, 'SetPurpose', 0);

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const [ethPrice] = useDexEthPrice(scaffoldAppProviders.mainnetAdaptor?.provider, scaffoldAppProviders.targetNetwork);

  // 💰 this hook will get your balance
  const [yourCurrentBalance] = useBalance(ethersContext.account ?? '');

  // -----------------------------
  // Hooks use and examples
  // -----------------------------
  // 🎉 Console logs & More hook examples:  Check out this to see how to get
  useScaffoldHooksExamples(scaffoldAppProviders);

  // -----------------------------
  // .... 🎇 End of examples
  // -----------------------------

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />

      {/* Routes should be added between the <Switch> </Switch> as seen below */}
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />
        <Switch>
          <Route exact path="/">
            <MainPageContracts scaffoldAppProviders={scaffoldAppProviders} />
          </Route>
          {/* you can add routes here like the below examlples */}
          <Route path="/hints">
            <Hints
              address={ethersContext?.account ?? ''}
              yourCurrentBalance={yourCurrentBalance}
              mainnetProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              price={ethPrice}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
              mainnetProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              yourCurrentBalance={yourCurrentBalance}
              price={ethPrice}
            />
          </Route>
          <Route path="/mainnetdai">
            {mainnetProvider != null && (
              <GenericContract
                contractName="DAI"
                contract={mainnetDai}
                mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
                blockExplorer={NETWORKS.mainnet.blockExplorer}
              />
            )}
          </Route>
          {/* <Route path="/subgraph">
            <Subgraph
              subgraphUri={subgraphUri}
              writeContracts={writeContracts}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
            />
          </Route> */}
        </Switch>
      </BrowserRouter>

      <MainPageFooter scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
    </div>
  );
};

export default Main;
