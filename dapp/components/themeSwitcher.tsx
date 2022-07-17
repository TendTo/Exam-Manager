import { useEffect } from "react";

function switchTheme() {
  const theme = localStorage.getItem("theme")!;
  const newTheme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  const html = document.getElementsByTagName("html").item(0);
  if (html) html.dataset.theme = newTheme;
}

export default function ThemeSwitcher() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const html = document.getElementsByTagName("html").item(0);
    // If local storage has a theme, set it
    if (theme) {
      if (html) html.dataset.theme = theme;
      return;
    }

    const newTheme =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    localStorage.setItem("theme", newTheme);
    if (html) html.dataset.theme = newTheme;
  }, []);

  return (
    <button onClick={switchTheme}>
      Switch Theme
    </button>
  );
}
