// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Predefined list of theme colors
  const themeColors = [
    "#9333ea", // Purple
    "#007acc", // Blue
    "#d9534f", // Red
    "#5cb85c", // Green
    "linear-gradient(45deg, #FE6B8B, #FF8E53)", // Pink-Orange Gradient
  ];

  const defaultTheme = themeColors[0]; // Set the default to the first color in the list

  // ✅ Load from localStorage OR fallback immediately
  const [theme, setTheme] = useState(
    localStorage.getItem("app-theme") || defaultTheme
  );

  // A secondary color for text, icons, and non-background elements
  const [secondaryColor, setSecondaryColor] = useState(
    localStorage.getItem("app-secondary-color") || defaultTheme
  );

  // ✅ Sync with localStorage + CSS variable whenever theme changes
  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.style.setProperty("--app-theme", theme);

    // Update secondary color logic based on the theme
    if (theme.startsWith("linear-gradient")) {
      const firstColor = theme.split(",")[1].trim();
      setSecondaryColor(firstColor);
      localStorage.setItem("app-secondary-color", firstColor);
    } else {
      setSecondaryColor(theme);
      localStorage.setItem("app-secondary-color", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, secondaryColor, setTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);