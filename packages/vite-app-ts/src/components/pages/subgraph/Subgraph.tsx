import { Button, Input, Table, Typography } from 'antd';

// import 'graphiql/graphiql.min.css';

import { Address } from 'eth-components/ant';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { TEthersProvider } from 'eth-hooks/models';
// import GraphiQL from 'graphiql';
import React, { FC, ReactElement, useContext, useState } from 'react';
import { useQuery } from 'react-query';

import { useAppContracts } from '~~/config/contractContext';

// const GraphiQL = lazy(() => import('graphiql'));

const highlight: React.CSSProperties = {
  marginLeft: 4,
  marginRight: 8,
  /* backgroundColor: "#f9f9f9", */ padding: 4,
  borderRadius: 4,
  fontWeight: 'bolder',
};

export interface ISubgraphProps {
  subgraphUri: string;
  mainnetProvider: TEthersProvider | undefined;
}

export const Subgraph: FC<ISubgraphProps> = (props) => {
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const graphQLFetcher = async (graphQLParams: any): Promise<Record<string, any>> => {
    const response = await fetch(props.subgraphUri, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    });
    return response.json() as Record<string, any>;
  };

  const ethersContext = useEthersContext();
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);
  const yourContract = useAppContracts('YourContract', ethersContext.chainId);

  const EXAMPLE_GQL = `
    {
      purposes(first: 25, orderBy: createdAt, orderDirection: desc) {
        id
        purpose
        createdAt
        sender {
          id
        }
      }
      senders {
        id
        address
        purposeCount
      }
    }
  `;
  const { isLoading, data } = useQuery(EXAMPLE_GQL, {});
  const graphqlData = data as any;

  const purposeColumns = [
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Sender',
      key: 'id',
      render: (record: any): ReactElement => (
        <Address address={record.sender.id} ensProvider={props.mainnetProvider} fontSize={16} />
      ),
    },
    {
      title: 'createdAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (d: number): string => new Date(d * 1000).toISOString(),
    },
  ];

  const [newPurpose, setNewPurpose] = useState('loading...');

  const deployWarning = (
    <div style={{ marginTop: 8, padding: 8 }}>Warning: 🤔 Have you deployed your subgraph yet?</div>
  );

  return (
    <>
      <div style={{ margin: 'auto', marginTop: 32 }}>
        You will find that parsing/tracking events with the{' '}
        <span className="highlight" style={highlight}>
          Listener
        </span>
        hook becomes a chore for every new project.
      </div>
      <div style={{ margin: 'auto', marginTop: 32 }}>
        Instead, you can use
        <a href="https://thegraph.com/docs/introduction" target="_blank" rel="noopener noreferrer">
          The Graph
        </a>
        with 🏗 scaffold-eth (
        <a href="https://youtu.be/T5ylzOTkn-Q" target="_blank" rel="noopener noreferrer">
          learn more
        </a>
        ):
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚮</span>
        Clean up previous data:
        <span className="highlight" style={highlight}>
          rm -rf docker/graph-node/data/
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📡</span>
        Spin up a local graph node by running
        <span className="highlight" style={highlight}>
          yarn graph-run-node
        </span>
        <span style={{ marginLeft: 4 }}>
          (requires
          <a href="https://www.docker.com/products/docker-desktop" target="_blank" rel="noopener noreferrer">
            Docker
          </a>
          )
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        Create your <b>local subgraph</b> by running
        <span className="highlight" style={highlight}>
          yarn graph-create-local
        </span>
        (only required once!)
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚢</span>
        Deploy your <b>local subgraph</b> by running
        <span className="highlight" style={highlight}>
          yarn graph-ship-local
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🖍️</span>
        Edit your <b>local subgraph</b> in
        <span className="highlight" style={highlight}>
          packages/subgraph/src
        </span>
        (learn more about subgraph definition{' '}
        <a href="https://thegraph.com/docs/define-a-subgraph" target="_blank" rel="noopener noreferrer">
          here
        </a>
        )
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤩</span>
        Deploy your <b>contracts and your subgraph</b> in one go by running
        <span className="highlight" style={highlight}>
          yarn deploy-and-graph
        </span>
      </div>

      <div style={{ width: 780, margin: 'auto', paddingBottom: 64 }}>
        <div style={{ margin: 32, textAlign: 'right' }}>
          <Input
            onChange={(e): void => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            onClick={(): void => {
              console.log('newPurpose', newPurpose);
              /* look how you call setPurpose on your contract: */
              void tx?.(yourContract?.setPurpose(newPurpose));
            }}>
            Set Purpose
          </Button>
        </div>

        {graphqlData?.purposes ? (
          <Table dataSource={graphqlData.purposes} columns={purposeColumns} rowKey="id" />
        ) : (
          <Typography>{isLoading ? 'Loading...' : deployWarning}</Typography>
        )}

        <div style={{ margin: 32, height: 400, border: '1px solid #888888', textAlign: 'left' }}>
          {/* <GraphiQL fetcher={graphQLFetcher} docExplorerOpen query={EXAMPLE_GQL} /> */}
        </div>
      </div>

      <div style={{ padding: 64 }}>...</div>
    </>
  );
};

export default Subgraph;
