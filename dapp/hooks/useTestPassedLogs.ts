import { useEthers } from "@usedapp/core";
import { useCallback, useEffect, useState } from "react";
import config from "config/contracts.json";
import { ExamContract__factory,ExamContract } from "types";
import { useAsync } from "./useAsync";


export function useTestPassedLogs(){
    const { library } = useEthers();
    const admin = useCallback(async () => {
        const contract = library ? ExamContract__factory.connect(config.examContractAddress, library) : undefined;
        return contract ? await contract.admin(): undefined;
    }, [library]);
    return useAsync(admin, true);
}
