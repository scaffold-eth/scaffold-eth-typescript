import { useEffect, useState } from 'react';
import { invariant } from 'ts-invariant';
import { ICoreOptions } from 'web3modal';

export const useGetWeb3ModalConfig = (
  hasLocalProvider: boolean = false,
  config: { infuraId: string }
): Partial<ICoreOptions> | undefined => {
  const [data, setData] = useState(false);
  const [web3Config, setWeb3Config] = useState?.<Partial<ICoreOptions>>();

  useEffect(() => {
    // import async to split bundles
    const importedConfig = import('../../config/web3Modal.config');

    importedConfig
      .then((getter) => {
        getter
          .getWeb3ModalConfig(hasLocalProvider, config)
          .then((config) => {
            setWeb3Config(config);
          })
          .catch((e) => {
            invariant.error('Web3Modal", "cannot load web3 modal config', e);
          });
      })
      .catch((e) => {
        invariant.error('Web3Modal", "cannot load web3 modal config', e);
      });
  }, []);

  return web3Config;
};
