import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import { Ramp, ThemeSwitcher } from '~~/app/common';
import { Faucet, GasGauge } from 'eth-components/ant';
import { NETWORKS } from '~~/models/constants/networks';
import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';
import { getNetworkInfo } from '~~/helpers/getNetworkInfo';
import { useEthersContext } from 'eth-hooks/context';
import { getFaucetAvailable } from '~~/app/common/FaucetHintButton';

export interface IMainPageFooterProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
}

/**
 * 🗺 Footer: Extra UI like gas price, eth price, faucet, and support:
 * @param props
 * @returns
 */
export const MainPageFooter: FC<IMainPageFooterProps> = (props) => {
  const ethersContext = useEthersContext();

  // Faucet Tx can be used to send funds from the faucet
  let faucetAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersContext);

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
          <Ramp price={props.price} address={ethersContext?.account ?? ''} networks={NETWORKS} />
        </Col>

        <Col
          span={8}
          style={{
            textAlign: 'center',
            opacity: 0.8,
          }}>
          <GasGauge
            chainId={props.scaffoldAppProviders.targetNetwork.chainId}
            currentNetwork={getNetworkInfo(ethersContext.chainId)}
            provider={ethersContext.ethersProvider}
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
            onClick={() => {
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
            props.scaffoldAppProviders?.mainnetProvider &&
            props.scaffoldAppProviders?.localProvider ? (
              <Faucet
                localProvider={props.scaffoldAppProviders.localProvider}
                price={props.price}
                mainnetProvider={props.scaffoldAppProviders.mainnetProvider}
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
