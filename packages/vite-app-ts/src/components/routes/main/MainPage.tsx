import React, { FC, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import { ExternalProvider, JsonRpcFetchFunc, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';

import '~~/styles/main-page.css';
import { Button, Alert } from 'antd';
import {
  useUserAddress,
  useGasPrice,
  useContractLoader,
  useContractReader,
  useBalance,
  useOnRepetition,
  useUserProviderAndSigner,
} from 'eth-hooks';
import { useExchangeEthPrice } from 'eth-hooks/dapps/dex';

import { Header, ThemeSwitcher } from '~~/components/common';
import { Account } from 'eth-components/ant';

import { GenericContract } from 'eth-components/ant/generic-contract';
import { Hints, Subgraph } from '~~/components/views';
import { ExampleUI } from '~~/components/views/ExampleUI';
import { transactor } from 'eth-components/functions';

import { parseEther } from '@ethersproject/units';

import { NETWORKS } from '~~/models/constants/networks';
import { getNetwork } from '~~/helpers/getNetwork';

import { ethers } from 'ethers';

import { TNetwork } from '~~/models/networkTypes';

import { TEthersProvider, TProviderAndSigner } from 'eth-hooks/models';
import { useEventListener } from 'eth-hooks/events';
import { MainPageMenu } from './components/MainPageMenu';
import { MainPageContracts } from './components/MainPageContracts';
import { MainPageExtraUi } from './components/MainPageExtraUi';
import { useContractConfig } from '~~/components/routes/main/hooks/useContractConfig';
import { EthComponentsContext } from 'eth-components/models';
import {
  useScaffoldProviders as useScaffoldProviders,
  targetNetwork,
  blockExplorer,
} from '~~/components/routes/main/hooks/useScaffoldProviders';
import { useBurnerFallback } from '~~/components/routes/main/hooks/useBurnerFallback';

const DEBUG = false;

const translateAddressesForLocal = (addy: string): string => {
  // if(addy=="0x90FC815Fe9338BB3323bAC84b82B9016ED021e70") return "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE"
  // if(addy=="0x21e18260357D33d2e18482584a8F39D532fb71cC") return "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
  return addy;
};

export const MainPage: FC<{ subgraphUri: string }> = (props) => {
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const appProviders = useScaffoldProviders();

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(appProviders.currentTargetNetwork, appProviders.mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, 'fast');
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  let currentProviderAndSigner: TProviderAndSigner | undefined = useUserProviderAndSigner(appProviders.currentProvider);
  currentProviderAndSigner = useBurnerFallback(currentProviderAndSigner);

  // You can warn the user if you would like them to be on a specific network
  let selectedChainId: number | undefined = currentProviderAndSigner.providerNetwork?.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks
  const context = useContext(EthComponentsContext);

  // The transactor wraps transactions and provides notificiations
  const tx = transactor(context, currentProviderAndSigner?.signer, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = transactor(context, currentProviderAndSigner?.signer, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(currentProviderAndSigner.provider, currentProviderAndSigner.address ?? '');

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(appProviders.mainnetProvider, currentProviderAndSigner.address ?? '');

  const contractsConfig = useContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(
    appProviders.currentProvider,
    contractsConfig,
    appProviders.currentTargetNetwork.chainId
  );

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(
    currentProviderAndSigner?.signer,
    contractsConfig,
    currentProviderAndSigner.providerNetwork?.chainId
  );

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(
    appProviders.mainnetProvider,
    contractsConfig,
    appProviders.mainnetProvider?._network?.chainId
  );

  // If you want to call a function on a new block
  useOnRepetition(
    (): void => console.log(`⛓ A new mainnet block is here: ${appProviders.mainnetProvider._lastBlockNumber}`),
    {
      provider: appProviders.mainnetProvider,
    }
  );

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, 'DAI', 'balanceOf', [
    '0x34aA3F359A9D614239015126635CE7732c18fDF3',
  ]);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader<string>(readContracts, 'YourContract', 'purpose');

  // 📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(
    readContracts,
    'YourContract',
    'SetPurpose',
    appProviders.currentProvider,
    1
  );

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */
  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (DEBUG && appProviders.mainnetProvider && currentProviderAndSigner?.address && selectedChainId) {
      console.log('_____________________________________ 🏗 scaffold-eth _____________________________________');
      console.log('🌎 mainnetProvider', appProviders.mainnetProvider);
      console.log('🕵🏻‍♂️ targetChainId:', targetNetwork.chainId);
      console.log('🏠 selected ChainId', selectedChainId);
      console.log('👩‍💼 selected address:', currentProviderAndSigner.address);

      /* console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")
      console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")
      console.log("📝 readContracts",readContracts)
      console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
      console.log("🔐 writeContracts",writeContracts) */
    }
  }, [
    appProviders.mainnetProvider,
    appProviders.currentTargetNetwork.chainId,
    selectedChainId,
    currentProviderAndSigner.address,
  ]);

  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId != targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(selectedChainId)?.name ?? 'UNKNOWN'}</b>.
      </div>
    );
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 60, padding: 16 }}>
        <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
      </div>
    );
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: 'absolute', right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint: ReactElement = <></>;
  /**
   * facuet is only available on localhost
   */
  const faucetAvailable =
    true &&
    currentProviderAndSigner.provider &&
    currentProviderAndSigner.providerNetwork?.chainId === targetNetwork.chainId &&
    targetNetwork.name === 'localhost';

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (!faucetClicked && faucetAvailable && yourLocalBalance && yourLocalBalance.toBigInt() <= 0) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={(): void => {
            if (faucetTx) {
              void faucetTx({
                to: currentProviderAndSigner?.address,
                value: parseEther('0.01'),
              });
            }
            setFaucetClicked(true);
          }}>
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />

        <Switch>
          <Route exact path="/">
            {currentProviderAndSigner != null && (
              <>
                {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
              */}
                <MainPageContracts
                  mainnetContracts={mainnetContracts}
                  mainnetProvider={mainnetProvider}
                  userProviderAndSigner={currentProviderAndSigner}
                  localProvider={localProvider}
                  blockExplorerUrl={blockExplorer}
                  userAddress={userAddress}
                  contractConfig={contractsConfig}
                />
              </>
            )}
          </Route>
          <Route path="/hints">
            <Hints
              address={userAddress}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
              address={userAddress}
              userSigner={currentProviderAndSigner?.signer}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={purpose ?? ''}
              setPurposeEvents={setPurposeEvents}
            />
          </Route>
          <Route path="/mainnetdai">
            {currentProviderAndSigner?.signer != null && (
              <GenericContract
                contractName="DAI"
                customContract={mainnetContracts?.contracts?.DAI as ethers.Contract | undefined}
                signer={currentProviderAndSigner.signer}
                provider={mainnetProvider}
                address={userAddress}
                blockExplorer="https://etherscan.io/"
                contractConfig={contractsConfig}
              />
            )}
          </Route>
          <Route path="/subgraph">
            <Subgraph
              subgraphUri={props.subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitcher />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        <Account
          address={userAddress}
          localProvider={localProvider}
          userSigner={currentProviderAndSigner?.signer}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3ModalProvider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <MainPageExtraUi
        mainnetProvider={mainnetProvider}
        price={price}
        gasPrice={gasPrice}
        userAddress={userAddress}
        faucetAvailable={faucetAvailable}
        localProvider={localProvider}
      />
    </div>
  );
};
