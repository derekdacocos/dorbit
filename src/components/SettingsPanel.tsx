"use client";

import { useRef, useState } from "react";
import CitySearch from "@/components/CitySearch";
import { useSettingsStore } from "@/stores/useSettingsStore";

type SettingsPanelProps = {
  onClose: () => void;
};

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const name = useSettingsStore((state) => state.name);
  const city = useSettingsStore((state) => state.city);
  const setName = useSettingsStore((state) => state.setName);
  const setCity = useSettingsStore((state) => state.setCity);

  const [savedCity, setSavedCity] = useState<string | null>(null); // for the "✓ Weather now shows..." message
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    // The dark see-through layer behind the panel. Clicking it closes the panel.
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24"
      onClick={onClose}
    >
      {/* stopPropagation: clicks inside the panel shouldn't reach the layer behind it */}
      <div
        className="glass w-full max-w-md rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 text-slate-400 hover:text-slate-200"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <label className="mb-1.5 block text-sm text-slate-400" htmlFor="settings-name">
          Your name
        </label>
        <input
          id="settings-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="What should we call you?"
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />

        <p className="mt-6 mb-1.5 text-sm text-slate-400">
          Weather city:{" "}
          {/* key={city.name}: a new city remounts the span, so the pop animation plays again */}
          <span key={city.name} className="pop-in inline-block font-medium text-slate-200">
            {city.name}
          </span>
        </p>
        <CitySearch
          onPick={(result) => {
            setCity({ name: result.name, latitude: result.latitude, longitude: result.longitude });
            // Show the confirmation for 4 seconds
            setSavedCity([result.name, result.admin1].filter(Boolean).join(", "));
            clearTimeout(hideTimeout.current);
            hideTimeout.current = setTimeout(() => setSavedCity(null), 4000);
          }}
        />

        {savedCity && (
          <p
            key={savedCity}
            className="pop-in mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-400 ring-1 ring-emerald-400/30"
          >
            ✓ Weather now shows {savedCity}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-violet-400 py-2 text-sm font-medium text-slate-950 hover:bg-violet-300"
        >
          Done
        </button>
      </div>
    </div>
  );
}