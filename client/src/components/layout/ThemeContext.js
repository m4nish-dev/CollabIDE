import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => null,
});

export const useTheme = () => useContext(ThemeContext);
