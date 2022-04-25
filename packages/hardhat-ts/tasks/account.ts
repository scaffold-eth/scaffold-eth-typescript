import { formatUnits } from '@ethersproject/units';
import { task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';
import * as qrcode from 'qrcode-terminal';
import { findFirstAddress, getAccountData } from 'tasks/functions/accounts';
import { DEBUG } from 'tasks/functions/debug';

import { config } from '../hardhat.config';

import { getMnemonic } from './functions/mnemonic';

task('account', 'Get balance informations for the deployment account.', async (_, hre) => {
  const { address } = await getAccountData(getMnemonic());

  qrcode.generate(address);
  console.log(`‍📬 Deployer Account is ${address}`);
  for (const n in config.networks) {
    // console.log(config.networks[n],n)
    try {
      const { url } = config.networks[n] as HttpNetworkUserConfig;
      const provider = new hre.ethers.providers.JsonRpcProvider(url);
      const balance = await provider.getBalance(address);
      console.log(` -- ${n} --  -- -- 📡 `);
      console.log(`   balance: ${hre.ethers.utils.formatEther(balance)}`);
      console.log(`   nonce: ${await provider.getTransactionCount(address)}`);
    } catch (e) {
      if (DEBUG) console.log(e);
    }
  }
});

task('balance', "Prints an account's balance")
  .addPositionalParam('account', "The account's address")
  .setAction(async (taskArgs: { account: string }, hre: THardhatRuntimeEnvironmentExtended) => {
    const balance = await hre.ethers.provider.getBalance(await findFirstAddress(hre, taskArgs.account));
    console.log(formatUnits(balance, 'ether'), 'ETH');
  });

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account: any) => console.log(account));
});
