import { parseEther } from '@ethersproject/units';
import { Button } from 'antd';
import { transactor } from 'eth-components/functions';
import { IEthComponentsSettings } from 'eth-components/models';
import { useBalance } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { IEthersContext } from 'eth-hooks/models';
import { utils } from 'ethers';
import React, { FC, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { IScaffoldAppProviders } from '~common/models/IScaffoldAppProviders';

/**
 * Is Faucet available?
 * @param scaffoldAppProviders
 * @param ethersAppContext
 * @returns
 */
export const getFaucetAvailable = (
  scaffoldAppProviders: IScaffoldAppProviders,
  ethersAppContext: IEthersContext,
  faucetEnabled: boolean
): boolean => {
  const result =
    (ethersAppContext?.provider &&
      ethersAppContext?.chainId != null &&
      ethersAppContext?.chainId === scaffoldAppProviders.targetNetwork.chainId &&
      scaffoldAppProviders.targetNetwork.name === 'localhost') ??
    false;
  return result && faucetEnabled;
};

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
  faucetEnabled: boolean;
  ethComponentSettings: IEthComponentsSettings;
}

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const ethersAppContext = useEthersAppContext();

  const [yourLocalBalance] = useBalance(ethersAppContext.account ?? '');
  const signer = props.scaffoldAppProviders.localAdaptor?.signer;
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(props.ethComponentSettings, signer, undefined, undefined, true);

  /**
   * facuet is only available on localhost
   */
  const isAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersAppContext, props.faucetEnabled);
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
