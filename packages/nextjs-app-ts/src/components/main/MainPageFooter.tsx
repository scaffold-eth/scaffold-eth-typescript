import { Row, Col, Button } from 'antd';
import { Faucet, GasGauge } from 'eth-components/ant';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC, ReactNode, Suspense } from 'react';

import { Ramp, getFaucetAvailable, ThemeSwitcher } from '~common/components';
import { networkDefinitions } from '~common/constants';
import { getNetworkInfo } from '~common/functions';
import { IScaffoldAppProviders } from '~common/models';
import { FAUCET_ENABLED } from '~~/config/nextjsApp.config';
import { TAppProps } from '~~/models/TAppProps';

export interface IMainPageFooterProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  children?: ReactNode;
  appProps: TAppProps;
}

/**
 * 🗺 Footer: Extra UI like gas price, eth price, faucet, and support:
 * @param props
 * @returns
 */
export const MainPageFooter: FC<IMainPageFooterProps> = (props) => {
  // passed in by nextjs getInitalProps
  const appProps: TAppProps = props.appProps;

  const ethersAppContext = useEthersAppContext();

  // Faucet Tx can be used to send funds from the faucet
  const faucetAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersAppContext, FAUCET_ENABLED);

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
          <Ramp price={props.price} address={ethersAppContext?.account ?? ''} networks={networkDefinitions} />
        </Col>

        <Col
          span={8}
          style={{
            textAlign: 'center',
            opacity: 0.8,
          }}>
          <GasGauge
            chainId={props.scaffoldAppProviders.currentTargetNetwork.chainId}
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
      <Suspense fallback={<div></div>}>{right}</Suspense>
    </>
  );
};
