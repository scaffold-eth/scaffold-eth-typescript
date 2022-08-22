import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';

export async function send(signer: Signer, txparams: TransactionRequest): Promise<TransactionResponse> {
  try {
    return await signer.sendTransaction(txparams);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
