import React, { useEffect } from "react";
import { ThemeContext } from "./ThemeContext";
import { useSettingsStore } from "@/store/useSettingsStore";

export const ThemeProvider = ({ children }) => {
  const theme = useSettingsStore(state => state.appearance?.theme || "dark");
  
  // Theme resolution logic (handling "system")
  const resolvedTheme = React.useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  // Apply to document for root-level CSS variables in tailwind (dark mode: class)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Optionally listen to system changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    useSettingsStore.getState().updateAppearance({ theme: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={resolvedTheme} className="h-full w-full">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { useTheme } from "./ThemeContext";
