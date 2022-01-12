import { useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { useBalance, useBlockNumber, useContractReader, useGasPrice, useSignerAddress } from 'eth-hooks';

import { useEthersContext } from 'eth-hooks/context';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { parseEther } from '@ethersproject/units';
import { config } from 'process';
import { NETWORKS } from '~~/models/constants/networks';
import { useAppContracts } from '~~/config/contractContext';
import { getNetworkInfo } from '~~/functions';
import { DEBUG } from '~~/config/debug';

/**
 * Logs to console current app state.  Shows you examples on how to use hooks!
 *
 * @param scaffoldAppProviders
 * @param currentEthersUser
 * @param readContracts
 * @param writeContracts
 * @param mainnetContracts
 */
export const useScaffoldHooksExamples = (scaffoldAppProviders: IScaffoldAppProviders) => {
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const ethersContext = useEthersContext();
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  let currentChainId: number | undefined = ethersContext.chainId;

  // ---------------------
  // 🏦 get your balance
  // ---------------------
  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const [yourLocalBalance] = useBalance(ethersContext.account ?? '');

  // ---------------------
  // 🤙🏽 calling an external function
  // ---------------------
  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(scaffoldAppProviders.mainnetProvider, currentEthersUser.address ?? '');

  // 💰 Then read your DAI balance like:
  const [myAddress] = useSignerAddress(ethersContext.signer);
  const myMainnetDAIBalance = useContractReader(mainnetDai, mainnetDai?.balanceOf, [myAddress ?? '']);

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));

  // ---------------------
  // 📛 call ens
  // ---------------------
  // const [addressFromENS] = useEnsResolveName(scaffoldAppProviders.mainnetProvider, 'austingriffith.eth');
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

  //----------------------
  // ✍🏽 writing to contracts
  //----------------------
  // The transactor wraps transactions and provides notificiations
  // you can use this for read write transactions
  // check out faucetHintButton.tsx for an example.
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  // here is another example of using tx

  // useEffect(() => {
  //   // only does it on local host and once cuz of the useeffect for safety
  //   if (tx && ethersContext?.chainId == NETWORKS.localhost.chainId) {
  //     const someaddress = ethersContext?.account;
  //     tx({
  //       to: someaddress,
  //       value: parseEther('0.01').toHexString(),
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (DEBUG && scaffoldAppProviders.mainnetAdaptor && ethersContext.account && currentChainId && yourLocalBalance) {
      console.log('_____________________________________ 🏗 scaffold-eth _____________________________________');
      console.log('🌎 mainnetProvider', scaffoldAppProviders.mainnetAdaptor);
      console.log('🏠 localChainId', scaffoldAppProviders?.localAdaptor?.chainId);
      console.log('👩‍💼 selected address:', ethersContext.account);
      console.log('🕵🏻‍♂️ currentChainId:', currentChainId);
      console.log('💵 yourLocalBalance', yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : '...');
      // console.log('💵 yourMainnetBalance', yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : '...');
      console.log('🌍 DAI contract on mainnet:', mainnetDai);
      console.log('💵 yourMainnetDAIBalance', myMainnetDAIBalance ?? '...');
      console.log('⛽ gasPrice', gasPrice);
    }
  }, [scaffoldAppProviders.mainnetAdaptor, ethersContext.account, ethersContext.provider]);
};
