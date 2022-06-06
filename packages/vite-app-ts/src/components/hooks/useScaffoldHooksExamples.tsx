/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable unused-imports/no-unused-vars-ts */
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import {
  useBalance,
  useBlockNumber,
  useContractReader,
  useEthersAdaptorFromProviderOrSigners,
  useGasPrice,
  useSignerAddress,
} from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { mergeDefaultUpdateOptions } from 'eth-hooks/functions';
import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';

import { useAppContracts } from '~common/components/context';
import { NETWORKS } from '~common/constants';
import { getNetworkInfo } from '~common/functions';
import { IScaffoldAppProviders } from '~common/models/IScaffoldAppProviders';

const DEBUG = false;

/**
 * Logs to console current app state.  Shows you examples on how to use hooks!
 *
 * @param scaffoldAppProviders
 * @param currentEthersUser
 * @param readContracts
 * @param writeContracts
 * @param mainnetContracts
 */
export const useScaffoldHooksExamples = (scaffoldAppProviders: IScaffoldAppProviders): void => {
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const ethersAppContext = useEthersAppContext();
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  const exampleMainnetProvider = scaffoldAppProviders.mainnetAdaptor?.provider;
  const currentChainId: number | undefined = ethersAppContext.chainId;

  // ---------------------
  // 🏦 get your balance
  // ---------------------
  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const [yourLocalBalance] = useBalance(ethersAppContext.account);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(exampleMainnetProvider);
  const [yourMainnetBalance, yUpdate, yStatus] = useBalance(ethersAppContext.account, mergeDefaultUpdateOptions(), {
    adaptorEnabled: true,
    adaptor: mainnetAdaptor,
  });

  // you can change the update schedule to every 10 blocks, the default is every 1 block:
  const [secondbalance] = useBalance(ethersAppContext.account, { blockNumberInterval: 10 });
  // you can change the update schedule to every polling, min is 10000ms
  const [thirdbalance] = useBalance(ethersAppContext.account, {
    refetchInterval: 100000,
    blockNumberInterval: undefined,
  });
  // you can use advanced react-query update options
  const [fourthbalance] = useBalance(ethersAppContext.account, {
    blockNumberInterval: 1,
    query: { refetchOnWindowFocus: true },
  });

  // ---------------------
  // 🤙🏽 calling an external function
  // ---------------------

  // 💰 Then read your DAI balance like:
  const [myAddress] = useSignerAddress(ethersAppContext.signer);
  const myMainnetDAIBalance = useContractReader(mainnetDai, mainnetDai?.balanceOf, [myAddress ?? '']);

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));

  // ---------------------
  // 📛 call ens
  // ---------------------
  // const [addressFromENS] = useResolveEnsName(scaffoldAppProviders.mainnetAdaptor?.provider, 'austingriffith.eth');
  // console.log('🏷 Resolved austingriffith.eth as:', addressFromENS);

  // ---------------------
  // 🔁 onBlock or on polling
  // ---------------------
  // This hook will let you invoke a callback on every block or with a polling time!
  // 🙋🏽‍♂️ on block is preffered!
  useBlockNumber(scaffoldAppProviders.mainnetAdaptor?.provider, (blockNumber) =>
    console.log(`⛓ A new mainnet block is here: ${blockNumber}`)
  );

  useBlockNumber(scaffoldAppProviders.localAdaptor?.provider, (blockNumber) =>
    console.log(`⛓ A new local block is here: ${blockNumber}`)
  );

  // ----------------------
  // ✍🏽 writing to contracts
  // ----------------------
  // The transactor wraps transactions and provides notificiations
  // you can use this for read write transactions
  // check out faucetHintButton.tsx for an example.
  const tx = transactor(ethComponentsSettings, ethersAppContext?.signer, gasPrice);

  // here is another example of using tx

  // useEffect(() => {
  //   // only does it on local host and once cuz of the useeffect for safety
  //   if (tx && ethersAppContext?.chainId == NETWORKS.localhost.chainId) {
  //     const someaddress = ethersAppContext?.account;
  //     tx({
  //       to: someaddress,
  //       value: parseEther('0.01').toHexString(),
  //     });
  //   }
  // }, []);

  // ---------------------
  // 🏭 check out eth-hooks!!!
  // ---------------------
  // docs: https://scaffold-eth.github.io/eth-hooks/
  // npm: https://www.npmjs.com/package/eth-hooks

  useEffect(() => {
    if (
      DEBUG &&
      scaffoldAppProviders.mainnetAdaptor &&
      ethersAppContext.account &&
      currentChainId &&
      yourLocalBalance
    ) {
      console.log('_____________________________________ 🏗 scaffold-eth _____________________________________');
      console.log('🌎 mainnetProvider', scaffoldAppProviders.mainnetAdaptor);
      console.log('🏠 localChainId', scaffoldAppProviders?.localAdaptor?.chainId);
      console.log('👩‍💼 selected address:', ethersAppContext.account);
      console.log('🕵🏻‍♂️ currentChainId:', currentChainId);
      console.log('💵 yourLocalBalance', yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : '...');
      // console.log('💵 yourMainnetBalance', yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : '...');
      console.log('🌍 DAI contract on mainnet:', mainnetDai);
      console.log('💵 yourMainnetDAIBalance', myMainnetDAIBalance ?? '...');
      console.log('⛽ gasPrice', gasPrice);
    }
  }, [scaffoldAppProviders.mainnetAdaptor, ethersAppContext.account, ethersAppContext.provider]);
};
