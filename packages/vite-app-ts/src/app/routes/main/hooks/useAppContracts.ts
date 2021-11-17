import { useState, useEffect } from 'react';
import { loadAppContractsConfig } from '~~/config/loadAppContractsConfig';
import { TContractConfig } from 'eth-hooks/models';

export const useAppContracts = (): TContractConfig => {
  const [contractsConfig, setContractsConfig] = useState<TContractConfig>({});

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
