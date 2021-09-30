import { Account } from 'eth-components/ant';
import { TEthersUser } from 'eth-hooks/models';
import { FC } from 'react';
import { blockExplorer, IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

interface IMainPageRightHeader {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  currentEthersUser: TEthersUser;
}

export const MainPageRightHeader: FC<IMainPageRightHeader> = (props) => {
  return (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
      <Account
        currentEthersUser={props.currentEthersUser}
        mainnetProvider={props.scaffoldAppProviders.mainnetProvider}
        isWeb3ModalUser={!props.scaffoldAppProviders.isUsingFallback}
        price={props.price}
        loadWeb3Modal={props.scaffoldAppProviders.web3ModalState.openWeb3ModalCallback}
        logoutOfWeb3Modal={props.scaffoldAppProviders.web3ModalState.logoutOfWeb3ModalCallback}
        blockExplorer={blockExplorer}
      />
      {props.children}
    </div>
  );
};
