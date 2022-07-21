import { JsonRpcProvider } from "@ethersproject/providers";
import { useAuthorizedProfAddedLogs } from "./useAuthorizedProfAddedLogs";
import { useAuthorizedProfRemovedLogs } from "./useAuthorizedProfRemovedLogs";

export function useProfessorCalls(
  provider: JsonRpcProvider | undefined,
  professorAddr: string | undefined
) {
  const { value: authorizedProfAdded } = useAuthorizedProfAddedLogs(provider, professorAddr);
  const { value: authorizedProfRemoved } = useAuthorizedProfRemovedLogs(provider, professorAddr);

  return { authorizedProfAdded, authorizedProfRemoved };
}
