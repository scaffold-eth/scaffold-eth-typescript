import React, { createContext, useContext, useEffect, useState } from "react";
import { ContractProvider, Contributors } from "@cob/contracts";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

interface ICOBApi {
  contributors(): Contributors
}

const COBContext = createContext<ICOBApi>({
  contributors(): Contributors {
    throw new Error("No contract provider")
  }
})

export default function COBProvider(props: React.PropsWithChildren) {

  const { chainId, connector } = useWeb3React();
  const [contracts, setContracts] = useState<ContractProvider|null>(null)

  useEffect(() => {
    if (connector.provider && chainId){
      const provider = new ethers.providers.Web3Provider(connector.provider)
      setContracts(new ContractProvider(provider, chainId))
    } else {
      setContracts(null)
    }
  }, [chainId])

  const contributors = () => {
    if (!contracts){
      throw new Error("No provider to make calls")
    }
    return contracts.get("Contributors");
  }

  return (
    <COBContext.Provider value={{ contributors }}>
          {props.children}
    </COBContext.Provider>
  )
}

export const useCOBApi = () => {
  return useContext(COBContext);
}
