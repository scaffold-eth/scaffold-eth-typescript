import React, { FC, useContext, useMemo, useState } from 'react';
import { Button } from 'antd';
import { useBalance } from 'eth-hooks';
import { transactor } from 'eth-components/functions';
import { parseEther } from '@ethersproject/units';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { utils } from 'ethers';
import { useEthersContext } from 'eth-hooks/context';
import { useDebounce } from 'use-debounce';
import { IEthersContext } from 'eth-hooks/models';
import { FAUCET_ENABLED } from '~~/config/appConfig';

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
}

export const getFaucetAvailable = (scaffoldAppProviders: IScaffoldAppProviders, ethersContext: IEthersContext) => {
  return (
    (FAUCET_ENABLED &&
      ethersContext?.provider &&
      ethersContext?.chainId === scaffoldAppProviders.targetNetwork.chainId &&
      scaffoldAppProviders.targetNetwork.name === 'localhost') ??
    false
  );
};

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const ethersContext = useEthersContext();

  const [yourLocalBalance] = useBalance(ethersContext.account ?? '');
  const signer = props.scaffoldAppProviders.localAdaptor?.signer;
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(settingsContext, signer, undefined, undefined, true);

  /**
   * facuet is only available on localhost
   */
  const [faucetAvailable] = useDebounce(getFaucetAvailable(props.scaffoldAppProviders, ethersContext), 500, {
    trailing: true,
  });
  const [faucetClicked, setFaucetClicked] = useState(false);

  const faucetHint = useMemo(() => {
    const min = parseFloat(utils.formatUnits(yourLocalBalance?.toBigInt() ?? 0, 'ether'));
    const lowFunds = yourLocalBalance && min < 0.002;
    const allowFaucet = faucetAvailable && !faucetClicked && lowFunds;

    if (allowFaucet && faucetAvailable && ethersContext?.account != null) {
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
