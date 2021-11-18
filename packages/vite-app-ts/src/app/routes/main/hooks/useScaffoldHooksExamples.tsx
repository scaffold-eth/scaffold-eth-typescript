import { useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';
import { DEBUG } from '../Main';
import { useBalance, useContractReader, useGasPrice, useOnRepetition } from 'eth-hooks';

import { useEthersContext } from 'eth-hooks/context';
import { getNetworkInfo } from '~~/helpers';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { parseEther } from '@ethersproject/units';
import { config } from 'process';
import { NETWORKS } from '~~/models/constants/networks';

/**
 * Logs to console current app state.  Shows you examples on how to use hooks!
 *
 * @param scaffoldAppProviders
 * @param currentEthersUser
 * @param readContracts
 * @param writeContracts
 * @param mainnetContracts
 */
export const useScaffoldHooks = (
  scaffoldAppProviders: IScaffoldAppProviders,
  readContracts: Record<string, ethers.Contract>,
  writeContracts: Record<string, ethers.Contract>,
  mainnetContracts: Record<string, ethers.Contract>
) => {
  const ethersContext = useEthersContext();
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);

  let currentChainId: number | undefined = ethersContext.chainId;

  // ---------------------
  // 🏦 get your balance
  // ---------------------
  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(ethersContext.account ?? '');

  // ---------------------
  // 🤙🏽 calling an external function
  // ---------------------
  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(scaffoldAppProviders.mainnetProvider, currentEthersUser.address ?? '');

  // 💰 Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts?.['DAI'], {
    contractName: 'DAI',
    functionName: 'balanceOf',
    functionArgs: ['0x34aA3F359A9D614239015126635CE7732c18fDF3'],
  });

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const gasPrice = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));

  // ---------------------
  // 📛 call ens
  // ---------------------
  // const addressFromENS = useEnsResolveName(scaffoldAppProviders.mainnetProvider, 'austingriffith.eth');
  // console.log('🏷 Resolved austingriffith.eth as:', addressFromENS);

  // ---------------------
  // 🔁 onBlock or on polling
  // ---------------------
  // This hook will let you invoke a callback on every block or with a polling time!
  // 🙋🏽‍♂️ on block is preffered!
  useOnRepetition(
    async (): Promise<void> =>
      console.log(`⛓ A new mainnet block is here: ${await scaffoldAppProviders.mainnetProvider.getBlockNumber()}`),
    {
      provider: scaffoldAppProviders.mainnetProvider,
    }
  );

  useOnRepetition(
    async (): Promise<void> =>
      console.log(`⛓ A new localblock block is here: ${await scaffoldAppProviders.localProvider.blockNumber}`),
    {
      provider: scaffoldAppProviders.localProvider,
    }
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
    if (
      DEBUG &&
      scaffoldAppProviders.mainnetProvider &&
      ethersContext.account &&
      currentChainId &&
      yourLocalBalance &&
      // yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log('_____________________________________ 🏗 scaffold-eth _____________________________________');
      console.log('🌎 mainnetProvider', scaffoldAppProviders.mainnetProvider);
      console.log('🏠 localChainId', scaffoldAppProviders.localProvider.network.chainId);
      console.log('👩‍💼 selected address:', ethersContext.account);
      console.log('🕵🏻‍♂️ currentChainId:', currentChainId);
      console.log('💵 yourLocalBalance', yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : '...');
      // console.log('💵 yourMainnetBalance', yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : '...');
      console.log('📝 readContracts', readContracts);
      console.log('🌍 DAI contract on mainnet:', mainnetContracts);
      console.log('💵 yourMainnetDAIBalance', myMainnetDAIBalance);
      console.log('🔐 writeContracts', writeContracts);
      console.log('⛽ gasPrice', gasPrice);
    }
  }, [
    scaffoldAppProviders.mainnetProvider,
    ethersContext.account,
    ethersContext.ethersProvider,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);
};
