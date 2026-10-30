"use client";

import { useState } from "react";
import CitySearch from "@/components/CitySearch";
import { useMounted } from "@/hooks/useMounted";
import { useSettingsStore } from "@/stores/useSettingsStore";

// The first-visit welcome: asks for a name and a weather city in one screen
export default function Welcome() {
  const name = useSettingsStore((state) => state.name);
  const city = useSettingsStore((state) => state.city);
  const welcomed = useSettingsStore((state) => state.welcomed);
  const setName = useSettingsStore((state) => state.setName);
  const setCity = useSettingsStore((state) => state.setCity);
  const finishWelcome = useSettingsStore((state) => state.finishWelcome);

  const mounted = useMounted();
  const [nameDraft, setNameDraft] = useState(""); // saved only when you press Start

  // Only for brand-new visitors. Someone who already has a name (like after signing in) skips it.
  if (!mounted || welcomed || name !== "") return null;

  function handleStart() {
    setName(nameDraft.trim());
    finishWelcome();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-3xl border border-white/10 p-6 text-white sm:p-8">
        <div className="pop-in text-center">
          <span className="float inline-block text-5xl">🪐</span>
          <h2 className="mt-3 text-2xl font-semibold">Welcome to Dorbit</h2>
          <p className="mt-1 text-sm text-slate-400">Two quick things and your sky is ready.</p>
        </div>

        <label className="mt-6 mb-1.5 block text-sm text-slate-400" htmlFor="welcome-name">
          1. What should we call you?
        </label>
        <input
          id="welcome-name"
          value={nameDraft}
          onChange={(event) => setNameDraft(event.target.value)}
          placeholder="Your name"
          autoFocus
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />

        <p className="mt-5 mb-1.5 text-sm text-slate-400">
          2. Where are you? Weather city:{" "}
          <span key={city.name} className="pop-in inline-block font-medium text-slate-200">
            {city.name}
          </span>
        </p>
        <CitySearch
          onPick={(result) =>
            setCity({ name: result.name, latitude: result.latitude, longitude: result.longitude })
          }
        />

        <button
          type="button"
          onClick={handleStart}
          className="mt-6 w-full rounded-xl bg-violet-500 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
        >
          Start exploring 🚀
        </button>
        <button
          type="button"
          onClick={finishWelcome}
          className="mt-2 w-full py-1 text-xs text-slate-500 hover:text-slate-300"
        >
          Skip for now · Used Dorbit before? Skip, then sign in to sync
        </button>
      </div>
    </div>
  );
}