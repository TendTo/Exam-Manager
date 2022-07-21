import createCtx from "./createCtx";

const [ctx, provider, useContext] = createCtx<number>();

export const SubjectIdContext = ctx;
export const SubjectIdContextProvider = provider;
export const useSubjectIdContext = useContext;
