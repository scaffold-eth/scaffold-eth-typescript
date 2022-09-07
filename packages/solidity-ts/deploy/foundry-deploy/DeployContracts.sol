// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { YourContractDeploy } from "./YourContract.deploy.sol";
import { YourNFTDeploy } from "./YourNFT.deploy.sol";

contract DeployContracts is Script {
  function setUp() public {}

  function run() public {
    vm.startBroadcast();
    new YourContractDeploy();
    new YourNFTDeploy();
    vm.stopBroadcast();
  }
}
