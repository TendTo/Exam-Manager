import { useAddStudent } from "./useAddStudent";
import { useDeleteStudent } from "./useDeleteStudent";
import { useAddSubject } from "./useAddSubject";
import { useAddAuthorizedProf } from "./useAddAuthorizedProf";
import { useRemoveAuthorizedProf } from "./useRemoveAuthorizedProf";

import { useEthers } from "@usedapp/core";
import { JsonRpcProvider } from "@ethersproject/providers";

export function useAdminFunctions(library: JsonRpcProvider | undefined){

  const { send: addStudent } = useAddStudent(library);
  const { send: deleteStudent } = useDeleteStudent(library);
  const { send: addSubject } = useAddSubject(library);
  const {send : addAuthorizedProf} = useAddAuthorizedProf(library);
  const {send : removeAuthorizedProf} = useRemoveAuthorizedProf(library);

  return { addStudent, deleteStudent, addSubject, addAuthorizedProf, removeAuthorizedProf };

}
