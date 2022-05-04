import { parseEther } from '@ethersproject/units';
import { Button } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useBalance } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { IEthersContext } from 'eth-hooks/models';
import { utils } from 'ethers';
import React, { FC, useContext, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { FAUCET_ENABLED } from '~~/config/app.config';

/**
 * Is Faucet available?
 * @param scaffoldAppProviders
 * @param ethersAppContext
 * @returns
 */
export const getFaucetAvailable = (
  scaffoldAppProviders: IScaffoldAppProviders,
  ethersAppContext: IEthersContext
): boolean => {
  const result =
    (ethersAppContext?.provider &&
      ethersAppContext?.chainId != null &&
      ethersAppContext?.chainId === scaffoldAppProviders.targetNetwork.chainId &&
      scaffoldAppProviders.targetNetwork.name === 'localhost') ??
    false;
  return result && FAUCET_ENABLED;
};

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
}

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const ethersAppContext = useEthersAppContext();

  const [yourLocalBalance] = useBalance(ethersAppContext.account ?? '');
  const signer = props.scaffoldAppProviders.localAdaptor?.signer;
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(settingsContext, signer, undefined, undefined, true);

  /**
   * facuet is only available on localhost
   */
  const isAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersAppContext);
  const [faucetAvailable] = useDebounce(isAvailable, 500, {
    trailing: true,
  });
  const [faucetClicked, setFaucetClicked] = useState(false);

  const faucetHint = useMemo(() => {
    const min = parseFloat(utils.formatUnits(yourLocalBalance?.toBigInt() ?? 0, 'ether'));
    const lowFunds = yourLocalBalance && min < 0.002;
    const allowFaucet = faucetAvailable && !faucetClicked && lowFunds;

    if (allowFaucet && ethersAppContext?.account != null) {
      return (
        <div style={{ paddingTop: 10, paddingLeft: 10 }}>
          <Button
            type="primary"
            onClick={(): void => {
              if (faucetTx && ethersAppContext?.account != null) {
                faucetTx({
                  to: ethersAppContext?.account,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yourLocalBalance, faucetAvailable, ethersAppContext?.account, faucetTx]);

  return <> {faucetHint} </>;
};
