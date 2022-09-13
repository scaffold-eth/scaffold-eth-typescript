// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { YourContractDeploy } from "./YourContract.deploy.s.sol";
import { YourNFTDeploy } from "./YourNFT.deploy.s.sol";

// import { YourNFT } from "contracts/yourNFT.sol";
// import { YourContract } from "contracts/yourContract.sol";

contract DeployContracts is Script {
  function setUp() public {}

  function run() public {
    YourContractDeploy yourContractDeploy = new YourContractDeploy();
    yourContractDeploy.setUp();
    yourContractDeploy.run();

    YourNFTDeploy yourNFTDeploy = new YourNFTDeploy();
    yourNFTDeploy.setUp();
    yourNFTDeploy.run();
  }
}
