import { readFile } from 'node:fs/promises';

import { readChildFiles } from 'scripts/functions/fileHelper';
import { invariant } from 'ts-invariant';

const mnemonicFolder = './mnemonic';
const defaultMnemonicFile = 'mnemonic.secret';

export const loadMnemonic = async (address: string | undefined = undefined): Promise<string> => {
  let file: string | undefined = undefined;
  if (address == null) {
    const defaultFile = await readChildFiles(mnemonicFolder, new RegExp(defaultMnemonicFile));
    invariant(defaultFile?.[0] == null, 'mnemonic file not found, generate one with yarn generate');

    file = defaultFile[0];
  } else {
    const files = await readChildFiles(mnemonicFolder, new RegExp(`^${address}\.secret$`));
    invariant(files?.[0] == null, `mnemonic file not found for address: ${address}`);

    file = files[0];
  }

  const data = (await readFile(file[0])).toString();
  invariant(data?.length > 40, `mnemonic file is empty or invalid for address: ${address}`);

  return data;
};
