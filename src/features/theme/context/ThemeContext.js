import { createContext, useContext } from "react";

const ThemeContext = createContext();

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "Error! useThemeContext must be used within ThemeProvidor."
    );
  }

  return context;
}

export default ThemeContext;
