import { NETWORKS } from '@scaffold-eth/common/src/constants';
import { getNetworkInfo } from '@scaffold-eth/common/src/functions/getNetworkInfo';
import { Row, Col, Button } from 'antd';
import { Faucet, GasGauge } from 'eth-components/ant';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC } from 'react';

import { Ramp, ThemeSwitcher } from '~~/components/common';
import { getFaucetAvailable } from '~~/components/common/FaucetHintButton';
import { IScaffoldAppProviders } from '~~/pages/main/hooks/useScaffoldAppProviders';

export interface IMainPageFooterProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  children?: React.ReactNode;
}

/**
 * 🗺 Footer: Extra UI like gas price, eth price, faucet, and support:
 * @param props
 * @returns
 */
export const MainPageFooter: FC<IMainPageFooterProps> = (props) => {
  const ethersAppContext = useEthersAppContext();

  // Faucet Tx can be used to send funds from the faucet
  const faucetAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersAppContext);

  const network = getNetworkInfo(ethersAppContext.chainId);

  const left = (
    <div
      style={{
        position: 'fixed',
        textAlign: 'left',
        left: 0,
        bottom: 20,
        padding: 10,
      }}>
      <Row align="middle" gutter={[4, 4]}>
        <Col span={8}>
          <Ramp price={props.price} address={ethersAppContext?.account ?? ''} networks={NETWORKS} />
        </Col>

        <Col
          span={8}
          style={{
            textAlign: 'center',
            opacity: 0.8,
          }}>
          <GasGauge
            chainId={props.scaffoldAppProviders.targetNetwork.chainId}
            currentNetwork={network}
            provider={ethersAppContext.provider}
            speed="average"
          />
        </Col>
        <Col
          span={8}
          style={{
            textAlign: 'center',
            opacity: 1,
          }}>
          <Button
            onClick={(): void => {
              window.open('https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA');
            }}
            size="large"
            shape="round">
            <span
              style={{
                marginRight: 8,
              }}
              role="img"
              aria-label="support">
              💬
            </span>
            Support
          </Button>
        </Col>
      </Row>

      <Row align="middle" gutter={[4, 4]}>
        <Col span={24}>
          {
            /*  if the local provider has a signer, let's show the faucet:  */
            faucetAvailable &&
            props.scaffoldAppProviders?.mainnetAdaptor &&
            props.scaffoldAppProviders?.localAdaptor ? (
              <Faucet
                localAdaptor={props.scaffoldAppProviders.localAdaptor}
                price={props.price}
                mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
              />
            ) : (
              <></>
            )
          }
        </Col>
      </Row>
    </div>
  );

  const right = <ThemeSwitcher />;

  return (
    <>
      {left}
      {right}
    </>
  );
};
