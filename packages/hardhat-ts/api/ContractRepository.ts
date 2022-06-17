import { Contributors__factory } from "./contract-types";
import { JsonRpcProvider } from "@ethersproject/providers";
import contractsExport from "./contracts.json";
import { ContractExport, Export, MultiExport } from "hardhat-deploy/dist/types";

const contracts = contractsExport as MultiExport;

const contractsFactoriesMap = {
  Contributors: Contributors__factory
} as const;

export class ContractProvider {
  constructor(
    private provider: JsonRpcProvider,
    private network: keyof typeof contracts,
    ) {
  }

  getExport(contractName: keyof typeof contractsFactoriesMap){
    const protocol = contracts[this.network][0] as Export;
    return protocol.contracts[contractName] as ContractExport;
  }

  get(contractName: keyof typeof contractsFactoriesMap) {
    const contractExport = this.getExport(contractName);
    return contractsFactoriesMap[contractName].connect(contractExport.address, this.provider);
  }
}
