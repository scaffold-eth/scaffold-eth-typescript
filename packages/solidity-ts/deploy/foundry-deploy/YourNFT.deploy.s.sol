// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { YourNFT } from "contracts/yourNFT.sol";

contract YourNFTDeploy is Script {
  function setUp() public {}

  function run() public {
    vm.startBroadcast();
    new YourNFT();
    vm.stopBroadcast();
  }
}
