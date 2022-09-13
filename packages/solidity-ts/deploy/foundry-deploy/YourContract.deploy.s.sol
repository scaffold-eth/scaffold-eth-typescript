// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { YourContract } from "contracts/yourContract.sol";

contract YourContractDeploy is Script {
  function setUp() public {}

  function run() public {
    vm.startBroadcast();
    new YourContract();
    vm.stopBroadcast();
  }
}
