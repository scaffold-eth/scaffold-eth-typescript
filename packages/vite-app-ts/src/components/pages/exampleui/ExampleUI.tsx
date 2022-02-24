/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { formatEther, parseEther } from '@ethersproject/units';
import { Button, Divider, Input, List } from 'antd';
import { Address, Balance } from 'eth-components/ant';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useContractReader, useEventListener, useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import React, { useState, FC, useContext, ReactNode } from 'react';

import { useAppContracts } from '~~/config/contractContext';
import { SetPurposeEvent } from '~~/generated/contract-types/YourContract';

export interface IExampleUIProps {
  mainnetProvider: StaticJsonRpcProvider | undefined;
  yourCurrentBalance: BigNumber | undefined;
  price: number;
}

export const ExampleUI: FC<IExampleUIProps> = (props) => {
  const [newPurpose, setNewPurpose] = useState('loading...');
  const ethersContext = useEthersContext();

  const yourContract = useAppContracts('YourContract', ethersContext.chainId);
  const [purpose] = useContractReader(yourContract, yourContract?.purpose, [], yourContract?.filters.SetPurpose());

  const [setPurposeEvents] = useEventListener<SetPurposeEvent>(yourContract, yourContract?.filters.SetPurpose(), 1);

  const signer = ethersContext.signer;
  const address = ethersContext.account ?? '';

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const { mainnetProvider, yourCurrentBalance, price } = props;

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 64 }}>
        <h2>Example UI:</h2>
        <h4>purpose: {purpose}</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={(e): void => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async (): Promise<void> => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx?.(yourContract?.setPurpose(newPurpose), (update: any) => {
                console.log('📡 Transaction Update:', update);
                if (update && (update.status === 'confirmed' || update.status === 1)) {
                  console.log(' 🍾 Transaction ' + update.hash + ' finished!');
                  console.log(
                    ' ⛽️ ' +
                      update.gasUsed +
                      '/' +
                      (update.gasLimit || update.gas) +
                      ' @ ' +
                      parseFloat(update.gasPrice) / 1000000000 +
                      ' gwei'
                  );
                }
              });
              console.log('awaiting metamask/web3 confirm result...', result);
              console.log(await result);
            }}>
            Set Purpose!
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourCurrentBalance ? formatEther(yourCurrentBalance) : '...'}</h2>
        <div>OR</div>
        <Balance address={address} price={price} />
        <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={parseEther('1000')} price={price} address={address} />
        <Divider />
        {/* use formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourCurrentBalance ? formatEther(yourCurrentBalance) : '...'}</h2>
        <Divider />
        Your Contract Address:
        <Address address={yourContract?.address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={(): void => {
              /* look how you call setPurpose on your contract: */
              void tx?.(yourContract?.setPurpose('🍻 Cheers'));
            }}>
            Set Purpose to &quot;🍻 Cheers&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={(): void => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              void tx?.({
                to: yourContract?.address,
                value: parseEther('0.001'),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}>
            Send Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={(): void => {
              /* look how we call setPurpose AND send some value along */
              void tx?.(yourContract?.setPurpose('💵 Paying for this one!'));
              /* this will fail until you make the setPurpose function payable */
            }}>
            Set Purpose With Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={(): void => {
              /* you can also just craft a transaction and send it to the tx() transactor */
              void tx?.({
                to: yourContract?.address,
                value: parseEther('0.001'),
                data: yourContract?.interface?.encodeFunctionData?.('setPurpose', ['🤓 Whoa so 1337!']),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}>
            Another Example
          </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width: 600, margin: 'auto', marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={(item: SetPurposeEvent): ReactNode => {
            return (
              <List.Item key={item.blockNumber + '_' + item.address}>
                <Address address={item.address} ensProvider={mainnetProvider} fontSize={16} /> {' - '}
                {item.args.purpose}
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};
