"use client";

import { useEffect } from "react";
import SkyOrbit from "@/components/SkyOrbit";
import Sparkles from "@/components/Sparkles";
import { useMounted } from "@/hooks/useMounted";
import { useSettingsStore } from "@/stores/useSettingsStore";

// Draws the space background (or your wallpaper) behind everything,
// and switches the light/dark theme on <html>
export default function Backdrop() {
  const theme = useSettingsStore((state) => state.theme);
  const wallpaper = useSettingsStore((state) => state.wallpaper);
  const mounted = useMounted();

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="sky" />
      <div className="nebula" />
      <div className="clouds" />
      <div className="stars stars-small" />
      <div className="stars stars-medium" />
      <div className="stars stars-big" />
      <Sparkles />
      <SkyOrbit />

      {mounted && wallpaper && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${wallpaper}")` }}
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </>
      )}
    </div>
  );
}