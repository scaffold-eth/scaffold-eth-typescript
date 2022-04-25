import { Signer } from 'ethers';
import fs from 'fs';
import { Provider } from '@ethersproject/providers';
import { task } from 'hardhat/config';
import { mnemonicPath } from './tasks/functions/mnemonic';
import { send } from './hardhat.config';
