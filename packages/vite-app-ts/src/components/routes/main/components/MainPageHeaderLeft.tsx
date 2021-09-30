import { getNetwork } from '@ethersproject/networks';
import { Alert, PageHeader } from 'antd';
import { TEthersUser, TNetwork } from 'eth-hooks/models';
import React, { FC, ReactElement } from 'react';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

// displays a page header
interface IMainPageHeaderLeft {
  currentEthersUser: TEthersUser;
  scaffoldAppProviders: IScaffoldAppProviders;
}

export const MainPageHeaderLeft: FC<IMainPageHeaderLeft> = (props) => {
  const selectedChainId = props.currentEthersUser.providerNetwork?.chainId;

  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId != props.scaffoldAppProviders.targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(selectedChainId)?.name ?? 'UNKNOWN'}</b>.
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
          zIndex: -1,
          position: 'absolute',
          right: 154,
          top: 28,
          padding: 16,
          color: props.scaffoldAppProviders.targetNetwork.color,
        }}>
        {props.scaffoldAppProviders.targetNetwork.name}
      </div>
    );
  }

  return (
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
      {networkDisplay}
      {props.children}
    </>
  );
};
