import { useState, useEffect } from "react";
import darkTheme from "primereact/resources/themes/lara-dark-blue/theme.css?inline";
import lightTheme from "primereact/resources/themes/lara-light-blue/theme.css?inline";

export function useTheme() {
  // Theme state: initialized from localStorage, defaulting to 'dark'
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Synchronize theme styles, classes, and localStorage in a side-effect
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // 1. Toggle dark class and set body colors (background is handled by the -z-20 div)
    if (theme === "dark") {
      root.classList.add("dark");
      body.style.backgroundColor = "transparent";
      body.style.color = "#f3f4f6";
    } else {
      root.classList.remove("dark");
      body.style.backgroundColor = "transparent";
      body.style.color = "#0f172a";
    }

    // 2. Swapping PrimeReact stylesheet strings
    let styleTag = document.getElementById("primereact-theme") as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "primereact-theme";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = theme === "dark" ? darkTheme : lightTheme;

    // 3. Persist theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, toggleTheme };
}
