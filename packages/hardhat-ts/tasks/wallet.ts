import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { parseUnits } from '@ethersproject/units';
import { Signer } from 'ethers';
import { task } from 'hardhat/config';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';
import { findFirstAddress } from 'tasks/functions/accounts';
import { debugLog } from 'tasks/functions/debug';
import { getMnemonic } from 'tasks/functions/mnemonic';

import { send } from './functions/send';

// eslint-disable-next-line @typescript-eslint/require-await
task('wallet', 'Create a wallet (pk) link', async (_, { ethers }): Promise<void> => {
  const randomWallet = ethers.Wallet.createRandom();
  const { privateKey } = randomWallet._signingKey();
  console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
  console.log(`🔗 http://localhost:3000/pk#${privateKey}`);
});

task('fundedwallet', 'Create a wallet (pk) link and fund it with deployer?')
  .addOptionalParam('amount', 'Amount of ETH to send to wallet after generating')
  .addOptionalParam('url', 'URL to add pk to')
  .setAction(async (taskArgs: { url?: string; amount?: string }, hre) => {
    const { ethers } = hre;
    const randomWallet = ethers.Wallet.createRandom();
    const { privateKey } = randomWallet._signingKey();
    console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
    const url = taskArgs.url != null ? taskArgs.url : 'http://localhost:3000';

    let localDeployerMnemonic: string | undefined;
    try {
      const mnemonic = getMnemonic();
      localDeployerMnemonic = mnemonic.toString().trim();
    } catch (e) {
      /* do nothing - this file isn't always there */
    }

    const amount = taskArgs.amount != null ? taskArgs.amount : '0.01';
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount),
    };

    // SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    if (localDeployerMnemonic != null) {
      let deployerWallet = ethers.Wallet.fromMnemonic(localDeployerMnemonic);
      deployerWallet = deployerWallet.connect(ethers.provider as Provider);
      console.log(`💵 Sending ${amount} ETH to ${randomWallet.address} using deployer account`);
      const sendresult = await deployerWallet.sendTransaction(tx);
      console.log(`\n${url}/pk#${privateKey}\n`);
      console.log(sendresult);
    } else {
      console.log(`💵 Sending ${amount} ETH to ${randomWallet.address} using local node`);
      console.log(`\n${url}/pk#${privateKey}\n`);

      return await send(ethers.provider.getSigner() as Signer, tx);
    }
  });

task('send', 'Send ETH')
  .addParam('from', 'From address or account index')
  .addOptionalParam('to', 'To address or account index')
  .addOptionalParam('amount', 'Amount to send in ether')
  .addOptionalParam('data', 'Data included in transaction')
  .addOptionalParam('gasPrice', 'Price you are willing to pay in gwei')
  .addOptionalParam('gasLimit', 'Limit of how much gas to spend')

  .setAction(
    async (
      taskArgs: { to?: string; from: string; amount?: string; gasPrice?: string; gasLimit?: number; data?: any },
      hre: THardhatRuntimeEnvironmentExtended
    ) => {
      const { network, ethers } = hre;
      const from = await findFirstAddress(hre, taskArgs.from);
      debugLog(`Normalized from address: ${from}`);
      const fromSigner = ethers.provider.getSigner(from);

      let to;
      if (taskArgs.to != null) {
        to = await findFirstAddress(hre, taskArgs.to);
        debugLog(`Normalized to address: ${to}`);
      }

      const txRequest: TransactionRequest = {
        from: await fromSigner.getAddress(),
        to,
        value: parseUnits(taskArgs.amount != null ? taskArgs.amount : '0', 'ether').toHexString(),
        nonce: await fromSigner.getTransactionCount(),
        gasPrice: parseUnits(taskArgs.gasPrice != null ? taskArgs.gasPrice : '1.001', 'gwei').toHexString(),
        gasLimit: taskArgs.gasLimit != null ? taskArgs.gasLimit : 24000,
        chainId: network.config.chainId,
      };

      if (taskArgs.data != null) {
        txRequest.data = taskArgs.data;
        debugLog(`Adding data to payload: ${txRequest.data}`);
      }
      debugLog(`${(txRequest.gasPrice as any) / 1000000000} gwei`);
      debugLog(JSON.stringify(txRequest, null, 2));

      return await send(fromSigner as Signer, txRequest);
    }
  );
