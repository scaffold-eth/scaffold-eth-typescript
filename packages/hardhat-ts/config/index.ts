import { Network } from 'hardhat/types'
import { AllNetworkTokens, Tokens } from 'helpers/types'

import { tokens } from './tokens'

/**
 * Checks if the network is Ethereum mainnet or one of its testnets
 * @param network {Network} Hardhat Network object
 * @param strict {boolean} Weather the check for mainnet should be restricted to exact match
 * @return boolean Boolean if the current network is Ethereum
 */
export const isEthereumNetwork = (network: Network, strict = false): boolean =>
  strict
    ? getNetworkName(network) === 'mainnet'
    : ['mainnet', 'kovan', 'rinkeby', 'ropsten'].some(
        (n) => n === getNetworkName(network)
      )

/**
 * Gets the current network name. If there is a `FORKING_NETWORK` environment variable set that is returned instead.
 * @param network {Network} Hardhat network object
 * @return string The current network name
 */
export const getNetworkName = (network: Network): string =>
  process.env.FORKING_NETWORK ?? network.name

/**
 * Gets the object of tokens specified by the config file including an `all` field which list every token by its symbol.
 * @param network {Network} Hardhat Network object
 * @return AllNetworkTokens Object of all tokens for the specified network
 */
export const getTokens = (network: Network): AllNetworkTokens => {
  const networkTokens = tokens[getNetworkName(network)]
  const all = Object.keys(networkTokens).reduce<Tokens>(
    (map, type) => ({
      ...map,
      ...networkTokens[type],
    }),
    {}
  )
  return {
    ...networkTokens,
    all,
  }
}
