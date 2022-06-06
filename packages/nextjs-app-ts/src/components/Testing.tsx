import { useBalance } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { useQuery } from 'react-query';
import { useScaffoldAppProviders } from '~common/components';
import {
  TARGET_NETWORK_INFO,
  CONNECT_TO_BURNER_AUTOMATICALLY,
  LOCAL_PROVIDER,
  MAINNET_PROVIDER,
  INFURA_ID,
} from '~~/config/app.config';

export const Testing = () => {
  const ethersAppContext = useEthersAppContext();
  console.log('sdfsdf');
  const config = {
    targetNetwork: TARGET_NETWORK_INFO,
    connectToBurnerAutomatically: CONNECT_TO_BURNER_AUTOMATICALLY,
    localProvider: LOCAL_PROVIDER,
    mainnetProvider: MAINNET_PROVIDER,
    infuraId: INFURA_ID,
  };
  console.log(config);

  useScaffoldAppProviders(config);
  useBalance('sdfsdfsdf');

  return <></>;
};
