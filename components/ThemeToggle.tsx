"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme from HTML attribute
    const html = document.documentElement;
    setIsDark(html.getAttribute("data-mode") === "dark");
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newMode = isDark ? "light" : "dark";
    html.setAttribute("data-mode", newMode);
    setIsDark(!isDark);
    // Persist preference
    localStorage.setItem("theme", newMode);
  };

  useEffect(() => {
    // Load saved preference on mount
    const saved = localStorage.getItem("theme");
    if (saved) {
      document.documentElement.setAttribute("data-mode", saved);
      setIsDark(saved === "dark");
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-kumo-tint hover:bg-kumo-interact transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-kumo-brand-text" />
      ) : (
        <Moon className="w-5 h-5 text-kumo-brand-text" />
      )}
    </button>
  );
}
