import { Contract } from "@ethersproject/contracts";
import { ContractFunctionNames } from "@usedapp/core/dist/esm/src/model/types";
import { useContractFunction as useDappContractFunction } from "@usedapp/core";

export function useContractFunction<C extends Contract, F extends ContractFunctionNames<C>>(
  contract: C | undefined,
  functionName: F
) {
  return useDappContractFunction(contract, functionName);
}

/**
 * Custom made version, not using @usedapp/core
 */
// export function useContractFunction<C extends Contract, F extends ContractFunctionNames<C>>(
//   contract: C | undefined,
//   functionName: F
// ) {
//   const contractFunction = useCallback(
//     async () => (contract ? await contract[functionName]() : undefined),
//     [contract, functionName]
//   );
//   return useAsync(contractFunction);
// }
