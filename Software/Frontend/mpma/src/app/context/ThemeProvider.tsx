"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// * Type definitions for theme functionality
type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme; // Current theme state
  toggleTheme: () => void; // Function to switch between themes
  setSystemTheme: () => void; // Function to sync with system theme
  isSystemTheme: boolean; // Whether theme is following system preferences
};

// ! Core theme context that provides theme state across the application
// ! This context is essential for consistent theming throughout the UI
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ! Provider component that manages theme state and persistence
// ! Wraps the application to provide theme functionality to all components
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ? State variables for theme management
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // * Helper function to get the current system theme preference
  const getSystemTheme = (): Theme => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // * Function to sync theme with system preferences
  const setSystemTheme = () => {
    setTheme(getSystemTheme());
    setIsSystemTheme(true);
    localStorage.setItem("useSystemTheme", "true");
  };

  // * On mount: load the theme from localStorage or system preferences
  // * This ensures theme persistence across page reloads
  useEffect(() => {
    setMounted(true);
    const useSystemTheme = localStorage.getItem("useSystemTheme") === "true";
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (useSystemTheme) {
      setSystemTheme();
    } else if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to system theme on first visit
      setSystemTheme();
    }
  }, []);

  // * Listen for changes in system color scheme preferences
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (isSystemTheme) {
        setTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, isSystemTheme]);

  // * Updates DOM attributes and persists theme changes to localStorage
  // * This effect runs whenever the theme changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);

      if (!isSystemTheme) {
        localStorage.setItem("theme", theme);
        localStorage.setItem("useSystemTheme", "false");
      }
    }
  }, [theme, mounted, isSystemTheme]);

  // ? Simple toggle function to switch between light and dark themes
  const toggleTheme = () => {
    setIsSystemTheme(false);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setSystemTheme, isSystemTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// * Custom hook to access theme context from any component
// * Provides type-safe access to theme state and toggle function
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
