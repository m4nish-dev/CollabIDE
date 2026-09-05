import React, { useState } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children, defaultTheme = "dark" }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme} className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { useTheme } from "./ThemeContext";
