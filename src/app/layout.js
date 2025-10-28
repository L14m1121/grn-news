"use client";
import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  // 🌓 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  // 🌗 Toggle theme globally
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <html lang="en">
      <body
        className={`transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#0a0a0a] text-[#f5f5f5]"
            : "bg-[#f7f4ec] text-[#111]"
        }`}
      >
        {/* Global Theme Context */}
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </body>
    </html>
  );
}

// 🔄 Create a quick theme context
import { createContext } from "react";
export const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });
