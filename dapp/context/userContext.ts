import createCtx from "./createCtx";

export type UserContextType = "notLogged" | "admin" | "student" | "professor" | "unknown";

const [ctx, provider, useContext] = createCtx<UserContextType>("notLogged");

export const UserContext = ctx;
export const UserContextProvider = provider;
export const useUserIdContext = useContext;
