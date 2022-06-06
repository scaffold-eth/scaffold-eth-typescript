import React, { FC } from 'react';

import dynamic from 'next/dynamic';

const DynamicMainPage = dynamic<{}>(() => import('~~/components/main/MainPage').then((mod) => mod.MainPage));

import { useCheckIsMounted } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import {
  TARGET_NETWORK_INFO,
  CONNECT_TO_BURNER_AUTOMATICALLY,
  LOCAL_PROVIDER,
  MAINNET_PROVIDER,
  INFURA_ID,
} from '~~/config/app.config';
import { useScaffoldAppProviders } from '~common/components';
import { Testing } from '~~/components/Testing';

const Page: FC = () => {
  const data = useCheckIsMounted();

  return (
    <>
      {/* <DynamicMainPage /> */}
      <Testing />
      <div>sdfsdfds</div>
    </>
  );
};

export default Page;
