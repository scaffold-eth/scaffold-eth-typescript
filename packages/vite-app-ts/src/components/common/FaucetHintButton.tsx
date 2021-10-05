import React, { FC, useContext, useMemo, useState } from 'react';
import { Button } from 'antd';
import { useBalance } from 'eth-hooks';
import { transactor } from 'eth-components/functions';
import { parseEther } from '@ethersproject/units';
import { EthComponentsContext } from 'eth-components/models';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { utils } from 'ethers';
import { IEthersContext, useEthersContext } from 'eth-hooks/context';

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
}

export const getFaucetAvailable = (scaffoldAppProviders: IScaffoldAppProviders, ethersContext: IEthersContext) => {
  return (
    (true &&
      ethersContext?.provider &&
      ethersContext?.chainId === scaffoldAppProviders.targetNetwork.chainId &&
      scaffoldAppProviders.targetNetwork.name === 'localhost') ??
    false
  );
};

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const settingsContext = useContext(EthComponentsContext);
  const ethersContext = useEthersContext();
  const yourLocalBalance = useBalance(ethersContext.account ?? '');
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(settingsContext, props.scaffoldAppProviders.localProvider);

  /**
   * facuet is only available on localhost
   */
  const faucetAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersContext);

  const [faucetClicked, setFaucetClicked] = useState(false);

  const faucetHint = useMemo(() => {
    const min = parseFloat(utils.formatUnits(yourLocalBalance.toBigInt(), 'ether'));

    if (!faucetClicked && faucetAvailable && yourLocalBalance && min < 0.002 && ethersContext?.account != null) {
      return (
        <div style={{ paddingTop: 10, paddingLeft: 10 }}>
          <Button
            type="primary"
            onClick={(): void => {
              if (faucetTx && ethersContext?.account != null) {
                void faucetTx({
                  to: ethersContext?.account,
                  value: parseEther('0.01'),
                });
              }
              setFaucetClicked(true);
            }}>
            💰 Grab funds from the faucet ⛽️
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
  }, [faucetAvailable, yourLocalBalance, faucetTx, ethersContext?.account]);

  return <> {faucetHint} </>;
};
