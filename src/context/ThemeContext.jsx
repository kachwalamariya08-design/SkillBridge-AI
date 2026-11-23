
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("skillBridgeTheme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  function toggleTheme() {
    setTheme((previousTheme) =>
      previousTheme === "light" ? "dark" : "light"
    );
  }

  useEffect(() => {
    localStorage.setItem("skillBridgeTheme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-theme ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
