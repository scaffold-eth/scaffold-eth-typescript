import React, { FC, useContext, useMemo, useState } from 'react';
import { Button } from 'antd';
import { useBalance } from 'eth-hooks';
import { transactor } from 'eth-components/functions';
import { parseEther } from '@ethersproject/units';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';
import { utils } from 'ethers';
import { IEthersContext, useEthersContext } from 'eth-hooks/context';
import { useDebounce } from 'use-debounce';

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
}

export const getFaucetAvailable = (scaffoldAppProviders: IScaffoldAppProviders, ethersContext: IEthersContext) => {
  return (
    (true &&
      ethersContext?.ethersProvider &&
      ethersContext?.chainId === scaffoldAppProviders.targetNetwork.chainId &&
      scaffoldAppProviders.targetNetwork.name === 'localhost') ??
    false
  );
};

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const ethersContext = useEthersContext();
  const yourLocalBalance = useBalance(ethersContext.account ?? '');
  const signer = props.scaffoldAppProviders.localProvider.getSigner();
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(settingsContext, signer, undefined, undefined, true);

  /**
   * facuet is only available on localhost
   */
  const faucetAvailable = useDebounce(getFaucetAvailable(props.scaffoldAppProviders, ethersContext), 500, {
    trailing: true,
  });
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
                faucetTx({
                  to: ethersContext?.account,
                  value: parseEther('0.01').toHexString(),
                })
                  .then(() => setFaucetClicked(true))
                  .catch(() => setFaucetClicked(false));
              }
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
