// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @notice It is the interface of functions that we use for the canonical WETH contract.
 *
 * @author develop@teller.finance
 */
interface IWETH {
    /**
     * @notice It withdraws ETH from the contract by sending it to the caller and reducing the caller's internal balance of WETH.
     * @param amount The amount of ETH to withdraw.
     */
    function withdraw(uint256 amount) external;

    /**
     * @notice It deposits ETH into the contract and increases the caller's internal balance of WETH.
     */
    function deposit() external payable;

    /**
     * @notice It gets the ETH deposit balance of an {account}.
     * @param account Address to get balance of.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @notice It transfers the WETH amount specified to the given {account}.
     * @param to Address to transfer to
     * @param value Amount of WETH to transfer
     */
    function transfer(address to, uint256 value) external returns (bool);
}
