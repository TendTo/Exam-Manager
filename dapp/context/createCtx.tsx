import { createContext, PropsWithChildren, useContext, useState } from "react";

type CustomUpdateType<A, B> = (prev: A, curr: B) => A;

type CtxReturn<A, B> = readonly [
  React.Context<{
    state: A;
    update: (curr: B) => void;
  }>,
  (props: PropsWithChildren<{}>) => JSX.Element,
  () => {
    state: A;
    update: (curr: B) => void;
  },
];

/**
 * Creates a react context that can be used to enable a global state sharead among all
 * the components of the app.
 * @returns A tuple containing the context, the provider and the specific useContext function.
 * @example
 * export type UserContextType = { user: string };
 *
 * const [ctx, provider, useContext] = createCtx<UserContextType>();
 *
 * export const userContext = ctx;
 * export const UserContextProvider = provider;
 * export const useUserContext = useContext;
 */
export default function createCtx<A>(): CtxReturn<A | undefined, A | undefined>;
/**
 * Creates a react context that can be used to enable a global state sharead among all
 * the components of the app.
 * @param defaultValue The initial state of the context.
 * @returns A tuple containing the context, the provider and the specific useContext function.
 * @example
 * export type ClickCountContextType = number;
 *
 * const [ctx, provider, useContext] = createCtx<ClickCountContextType>(0);
 *
 * export const clickCountContext = ctx;
 * export const ClickCountContextProvider = provider;
 * export const useClickCountContext = useContext;
 */
export default function createCtx<A>(defaultValue: A): CtxReturn<A, A>;
/**
 * Creates a react context that can be used to enable a global state sharead among all
 * the components of the app.
 * The customUpdate function will take as arguments the previous state and the current state
 * and return the new state.
 * @param defaultValue The initial state of the context.
 * @param customUpdate The custom update function used to set the new state of the context.
 * @returns A tuple containing the context, the provider and the specific useContext function.
 * @example
 * export type ThemeContextType = "light" | "dark";
 *
 * const [ctx, provider, useContext] = createCtx<ThemeContextType>(
 *   "light",
 *   (theme) => (theme === "light" ? "dark" : "light"),
 * );
 *
 * export const themeContext = ctx;
 * export const ThemeContextProvider = provider;
 * export const useThemeContext = useContext;
 * @example
 * export type MaximumContextType = number;
 *
 * const [ctx, provider, useContext] = createCtx<MaximumContextType, number>(
 *   0,
 *   (currentMax, newMax) => Math.max(currentMax, newMax),
 * );
 *
 * export const maxContext = ctx;
 * export const MaxContextProvider = provider;
 * export const useMaxContext = useContext;
 */
export default function createCtx<A, B = void>(
  defaultValue: A,
  customUpdate: CustomUpdateType<A, B>,
): CtxReturn<A, B>;
export default function createCtx<A, B>(
  defaultValue?: A,
  customUpdate?: CustomUpdateType<typeof defaultValue, B>,
) {
  const ctx = createContext({
    state: defaultValue,
    update: (_: any) => {},
  });
  function Provider(props: PropsWithChildren<{}>) {
    const [state, setState] = useState(defaultValue);
    const update = customUpdate
      ? (curr: B) => setState(customUpdate(state, curr))
      : (curr: A) => setState(curr);
    return <ctx.Provider value={{ state, update }} {...props} />;
  }
  return [ctx, Provider, () => useContext(ctx)] as const;
}
