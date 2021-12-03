import { BigNumber, BigNumberish, Signer } from 'ethers'
import { IUniswapV2Router, IWETH } from 'generated/typechain'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ADDRESSES } from 'helpers/consts'
import { Address, TokenSymbol } from 'helpers/types'

import { getTokens, isEthereumNetwork } from '../config'

export interface SwapArgs {
  to: Address | Signer
  tokenSym: TokenSymbol
  amount: BigNumberish
  hre: HardhatRuntimeEnvironment
}

export const getFunds = async (args: SwapArgs): Promise<void> => {
  const { getNamedSigner, ethers, contracts, network } = args.hre

  const forkingNetworkName = process.env.FORKING_NETWORK
  const funder = await getNamedSigner('funder')
  const { all: tokenAddresses } = getTokens(args.hre.network)

  let routerAddress: string
  const path: string[] = []
  // If the forked network is polygon (or something other than L1 eth)
  // Use the Sushiswap router Polygon address instead of Mainnet Uniswap
  switch (forkingNetworkName) {
    case 'mainnet':
    case 'kovan':
    case 'rinkeby':
    case 'ropsten':
      routerAddress = ADDRESSES[forkingNetworkName].UNISWAP_ROUTER_V2
      path.push(tokenAddresses.WETH)
      break
    case 'polygon':
    case 'polygon_mumbai':
      routerAddress = ADDRESSES[forkingNetworkName].SUSHISWAP_ROUTER_V2
      path.push(tokenAddresses.WMATIC)
      if (args.tokenSym !== 'WETH') {
        path.push(tokenAddresses.WETH)
      }
      break
    default:
      throw new Error(`Forking network is invalid: ${forkingNetworkName}`)
  }

  // Uniswap - https://uniswap.org/docs/v2/smart-contracts/router02/ the Router V2 instance
  const swapper = await contracts.get<IUniswapV2Router>('IUniswapV2Router', {
    at: routerAddress,
    from: funder,
  })

  const toAddress = Signer.isSigner(args.to)
    ? await args.to.getAddress()
    : args.to

  if (args.tokenSym === 'ETH' || args.tokenSym === 'MATIC') {
    await funder.sendTransaction({
      to: toAddress,
      value: args.amount,
    })
  } else if (args.tokenSym === 'WETH' && isEthereumNetwork(network)) {
    await sendWrappedNativeToken({
      tokenAddress: tokenAddresses.WETH,
      amount: args.amount,
      hre: args.hre,
      toAddress,
    })
  } else if (args.tokenSym === 'WMATIC' && !isEthereumNetwork(network)) {
    await sendWrappedNativeToken({
      tokenAddress: tokenAddresses.WMATIC,
      amount: args.amount,
      hre: args.hre,
      toAddress,
    })
  } else {
    // ETH/MATIC balance
    const deployerBalance = await ethers.provider.getBalance(
      funder.getAddress()
    )
    const balanceToSend = deployerBalance.mul('1').div('10')
    // Swap ETH/WMATIC for given token
    await swapper.swapETHForExactTokens(
      args.amount,
      [...path, tokenAddresses[args.tokenSym]],
      toAddress,
      Date.now() + 10000,
      { value: balanceToSend }
    )
  }
}

export interface SendNativeTokenArgs {
  tokenAddress: string
  amount: BigNumberish
  toAddress: string
  hre: HardhatRuntimeEnvironment
}

const sendWrappedNativeToken = async (
  args: SendNativeTokenArgs
): Promise<BigNumber> => {
  const funder = await args.hre.getNamedSigner('funder')
  const weth = await args.hre.contracts.get<IWETH>('IWETH', {
    at: args.tokenAddress,
    from: funder,
  })
  const balanceToSend = args.hre.ethers.BigNumber.from(args.amount).mul(2)
  await weth.deposit({ value: balanceToSend, from: funder.getAddress() })
  await weth.transfer(args.toAddress, args.amount, {
    from: funder.getAddress(),
  })
  return await weth.balanceOf(args.toAddress)
}
