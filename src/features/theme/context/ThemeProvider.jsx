import { useState } from "react";
import ThemeContext from "./ThemeContext";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const themeMethods = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={themeMethods}>
      {children}
    </ThemeContext.Provider>
  );
}
