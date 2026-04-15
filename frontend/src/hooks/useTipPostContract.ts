import { Contract, type ContractRunner, type InterfaceAbi } from "ethers";
import { useMemo } from "react";
import TipPostArtifact from "../abi/TipPost.json";
import { assertConfiguredAddress, getContractAddress } from "../config";

const abi = TipPostArtifact.abi as InterfaceAbi;

export function useTipPostContract(runner: ContractRunner | null) {
  const address = getContractAddress();

  return useMemo(() => {
    if (!runner || !address) return null;
    assertConfiguredAddress(address);
    return new Contract(address, abi, runner);
  }, [runner, address]);
}
