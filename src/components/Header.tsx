"use client";

import { useMounted } from "@/hooks/useMounted";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function Header() {
  const theme = useSettingsStore((state) => state.theme);
  const wallpaper = useSettingsStore((state) => state.wallpaper);
  const isCustomizing = useSettingsStore((state) => state.isCustomizing);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const setWallpaper = useSettingsStore((state) => state.setWallpaper);
  const toggleCustomizing = useSettingsStore((state) => state.toggleCustomizing);
  const mounted = useMounted();

  function changeWallpaper() {
    const url = window.prompt("Paste an image link for your wallpaper (leave empty to remove it):", wallpaper);
    if (url === null) return; // you clicked Cancel
    setWallpaper(url.trim());
  }

  const buttonClass =
    "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10";

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Planet with a ring, and a small moon that travels around the ring */}
        <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
          <circle cx="32" cy="32" r="14" fill="#A78BFA" />
          <g transform="rotate(-20 32 32)">
            <ellipse
              cx="32"
              cy="32"
              rx="28"
              ry="10"
              fill="none"
              strokeWidth="3"
              className="stroke-slate-200"
            />
            <circle r="4" fill="#C4B5FD">
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M4,32 a28,10 0 1,0 56,0 a28,10 0 1,0 -56,0"
              />
            </circle>
          </g>
        </svg>
        <span className="text-xl font-semibold">Dorbit</span>
      </div>

      {mounted && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleCustomizing}
            className={isCustomizing ? buttonClass + " ring-1 ring-violet-400" : buttonClass}
          >
            {isCustomizing ? "Done" : "Customize"}
          </button>
          <button type="button" onClick={toggleTheme} className={buttonClass} title="Switch theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button type="button" onClick={changeWallpaper} className={buttonClass} title="Change wallpaper">
            🖼️
          </button>
        </div>
      )}
    </header>
  );
}