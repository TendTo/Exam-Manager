import { Contract } from "@ethersproject/contracts";
import { ContractMethodNames } from "@usedapp/core/dist/esm/src/model/types";
import { Call, QueryParams, useCall as useDappCall } from "@usedapp/core";

export function useCall<C extends Contract, F extends ContractMethodNames<C>>(
  contract: Call<C, F> | undefined,
  queryParams?: QueryParams
) {
  return useDappCall(contract, queryParams);
}

/**
 * Custom made version, not using @usedapp/core
 */

// export function useCall<C extends Contract, F extends ContractFunctionNames<C>>(
//   contract: C | undefined,
//   functionName: F
// ) {
//   const contractCall = useCallback(async () => {
//     return contract ? await contract[functionName]() : undefined;
//   }, [contract, functionName]);
//   return useAsync(contractCall);
// }
