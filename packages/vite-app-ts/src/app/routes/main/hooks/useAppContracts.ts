import { TContractLoaderConfig } from 'eth-hooks/models';
import { useState, useEffect } from 'react';

import { loadAppContractsConfig } from '~~/config/loadAppContractsConfig';

export const useAppContracts = (): TContractLoaderConfig => {
  const [contractsConfig, setContractsConfig] = useState<TContractLoaderConfig>({});

  useEffect(() => {
    const loadFunc = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await loadAppContractsConfig();
      setContractsConfig(result);
    };
    void loadFunc();
  }, []);
  return contractsConfig;
};
