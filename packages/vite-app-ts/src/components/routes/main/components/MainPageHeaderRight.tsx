import { Account } from 'eth-components/ant';
import { TEthersUser } from 'eth-hooks/models';
import { FC } from 'react';
import { FaucetHintButton as FaucetHintButton } from '~~/components/common/FaucetHintButton';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

interface IMainPageHeaderRight {
  scaffoldAppProviders: IScaffoldAppProviders;
  currentEthersUser: TEthersUser;
  price: number;
  gasPrice: number | undefined;
}

export const MainPageHeaderRight: FC<IMainPageHeaderRight> = (props) => {
  return (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
      <Account
        currentEthersUser={props.currentEthersUser}
        mainnetProvider={props.scaffoldAppProviders.mainnetProvider}
        isWeb3ModalUser={!props.scaffoldAppProviders.isUsingFallback}
        price={props.price}
        loadWeb3Modal={props.scaffoldAppProviders.web3ModalState.openWeb3ModalCallback}
        logoutOfWeb3Modal={props.scaffoldAppProviders.web3ModalState.logoutOfWeb3ModalCallback}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
      />
      <FaucetHintButton
        scaffoldAppProviders={props.scaffoldAppProviders}
        currentEthersUser={props.currentEthersUser}
        gasPrice={props.gasPrice}
      />
      {props.children}
    </div>
  );
};
