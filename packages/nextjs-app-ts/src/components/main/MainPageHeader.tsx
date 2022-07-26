import { getNetwork } from '@ethersproject/networks';
import { Alert, PageHeader } from 'antd';
import { Account } from 'eth-components/ant';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useGasPrice } from 'eth-hooks';
import {
  useEthersAppContext,
  connectorErrorText,
  NoStaticJsonRPCProviderFoundError,
  CouldNotActivateError,
  UserClosedModalError,
} from 'eth-hooks/context';
import React, { FC, ReactElement, ReactNode, useCallback, useContext } from 'react';

import { FaucetHintButton } from '~common/components';
import { useAntNotification } from '~common/components/hooks';
import { getNetworkInfo } from '~common/functions';
import { IScaffoldAppProviders } from '~common/models';
import { FAUCET_ENABLED } from '~~/config/app.config';

// displays a page header
export interface IMainPageHeaderProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  children?: ReactNode;
}

/**
 * ✏ Header: Edit the header and change the title to your project name.  Your account is on the right *
 * @param props
 * @returns
 */
export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const ethersAppContext = useEthersAppContext();
  const selectedChainId = ethersAppContext.chainId;

  const notification = useAntNotification();

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));

  /**
   * this shows the page header and other informaiton
   */
  const left = (
    <>
      <div>
        <PageHeader
          title="🏭 Scaffold-Eth"
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

  const onLoginError = useCallback(
    (e: Error) => {
      if (e instanceof UserClosedModalError) {
        notification.info({
          message: connectorErrorText.UserClosedModalError,
          description: e.message,
        });
      } else if (e instanceof NoStaticJsonRPCProviderFoundError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.NoStaticJsonRPCProviderFoundError,
          description: e.message,
        });
      } else if (e instanceof CouldNotActivateError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.CouldNotActivateError,
          description: e.message,
        });
      } else {
        notification.error({ message: 'Login Error: ', description: e.message });
      }
    },
    [notification]
  );

  /**
   * 👨‍💼 Your account is in the top right with a wallet at connect options
   */
  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10, zIndex: 1 }}>
      <Account
        createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
        loginOnError={onLoginError}
        ensProvider={props.scaffoldAppProviders.mainnetAdaptor?.provider}
        price={props.price}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        hasContextConnect={true}
      />
      <FaucetHintButton
        ethComponentSettings={settingsContext}
        scaffoldAppProviders={props.scaffoldAppProviders}
        gasPrice={gasPrice}
        faucetEnabled={FAUCET_ENABLED}
      />
      {props.children}
    </div>
  );

  /**
   * display the current network on the top left
   */
  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId !== props.scaffoldAppProviders.targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(props.scaffoldAppProviders.targetNetwork)?.name ?? 'UNKNOWN'}</b>.
      </div>
    );
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 90, padding: 16 }}>
        <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
      </div>
    );
  } else {
    networkDisplay = (
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 84,
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
