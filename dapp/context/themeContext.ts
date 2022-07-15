import createCtx from "./createCtx";

export type ThemeContextType = "light" | "dark";

const [ctx, provider, useContext] = createCtx<ThemeContextType>(
  "light",
  (theme) => (theme === "light" ? "dark" : "light"),
);

export const themeContext = ctx;
export const ThemeContextProvider = provider;
export const useThemeContext = useContext;
