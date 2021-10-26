import { Account } from 'eth-components/ant';
import { getNetwork } from '@ethersproject/networks';
import { Alert, PageHeader } from 'antd';
import React, { FC, ReactElement } from 'react';
import { FaucetHintButton } from '~~/components/common/FaucetHintButton';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { useEthersContext } from 'eth-hooks/context';

// displays a page header
interface IMainPageHeader {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  gasPrice: number | undefined;
}

export const MainPageHeader: FC<IMainPageHeader> = (props) => {
  const ethersContext = useEthersContext();
  const selectedChainId = ethersContext.chainId;

  /**
   * this shows the page header and other informaiton
   */
  const left = (
    <>
      <div>
        <PageHeader
          title="🏰 BuidlGuidl"
          subTitle={
            <span>
              v2.1 - [
              <a href="https://youtu.be/aYMj00JoIug" target="_blank" rel="noreferrer">
                <span style={{ marginRight: 4 }}>🎥 </span> 8min speed run
              </a>
              ] - [
              <a href="https://trello.com/b/ppbUs796/buidlguidlcom-idea-board" target="_blank" rel="noreferrer">
                <span style={{ marginRight: 4 }}>💡 </span> trello
              </a>
              ]{' '}
            </span>
          }
          style={{ cursor: 'pointer' }}
        />
      </div>
      {props.children}
    </>
  );

  /**
   * 👨‍💼 Your account is in the top right with a wallet at connect options
   */
  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
      <Account
        createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
        ensProvider={props.scaffoldAppProviders.mainnetProvider}
        price={props.price}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        hasContextConnect={true}
      />
      <FaucetHintButton scaffoldAppProviders={props.scaffoldAppProviders} gasPrice={props.gasPrice} />
      {props.children}
    </div>
  );

  /**
   * display the current network on the top left
   */
  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId != props.scaffoldAppProviders.targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(props.scaffoldAppProviders.targetNetwork)?.name ?? 'UNKNOWN'}</b>.
      </div>
    );
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 60, padding: 16 }}>
        <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
      </div>
    );
  } else {
    networkDisplay = (
      <div
        style={{
          position: 'absolute',
          right: 18,
          top: 54,
          padding: 10,
          color: props.scaffoldAppProviders.targetNetwork.color,
        }}>
        {props.scaffoldAppProviders.targetNetwork.name}
      </div>
    );
  }

  return (
    <>
      {left}
      {networkDisplay}
      {right}
    </>
  );
};
