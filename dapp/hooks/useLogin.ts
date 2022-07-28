import { useEthers } from "@usedapp/core";
import { useCallback, useState } from "react";
import { ExamContract__factory } from "types";
import { useAsync } from "./useAsync";
import config from "config/contracts.json";
import { useUserIdContext } from "context";

export type UserContextType = "notLogged" | "admin" | "student" | "professor" | "unknown";

function getUser(
  account: string,
  admin: string,
  studentId: number,
  subjectTeached: number
): UserContextType {
  if (account === undefined) return "notLogged";
  if (admin && account === admin) return "admin";
  if (studentId !== 0) return "student";
  if (subjectTeached > 0) return "professor";
  return "unknown";
}

export function useLogin() {
  const { account, chainId, library } = useEthers();
  const { state: user, update } = useUserIdContext();

  const contractCall = useCallback(async () => {
    if (!library || !account || !chainId) {
      update("notLogged");
      return { admin: undefined, studentId: undefined, logs: [] };
    }
    const contract = ExamContract__factory.connect(config.examContractAddress, library);
    const filter = contract.filters.AuthorizedProfAdded(null, account);
    const [admin, studentId, logs] = await Promise.all([
      contract.admin(),
      contract.studentIds(account),
      contract.queryFilter(filter),
    ]);
    update(getUser(account, admin, studentId.toNumber(), logs.length));
    return { admin, studentId: studentId.toNumber(), logs };
  }, [account, chainId, library]);
  return { ...useAsync(contractCall, true, undefined), user };
}
