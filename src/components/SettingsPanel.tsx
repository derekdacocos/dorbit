"use client";

import { useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/lib/geocoding";
import { useSettingsStore } from "@/stores/useSettingsStore";

type SettingsPanelProps = {
  onClose: () => void;
};

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const name = useSettingsStore((state) => state.name);
  const city = useSettingsStore((state) => state.city);
  const setName = useSettingsStore((state) => state.setName);
  const setCity = useSettingsStore((state) => state.setCity);

  const [cityDraft, setCityDraft] = useState("");
  const [search, setSearch] = useState(""); // the search we actually run
  const [savedCity, setSavedCity] = useState<string | null>(null); // for the "✓ Weather now shows..." message
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Only searches once you press Search (enabled: false = wait)
  const { data: results, isFetching, isError } = useQuery({
    queryKey: ["cities", search],
    queryFn: () => searchCities(search),
    enabled: search !== "",
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(cityDraft.trim());
  }

  const inputClass =
    "min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400";

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
          className={inputClass + " w-full"}
        />

        <p className="mt-6 mb-1.5 text-sm text-slate-400">
          Weather city:{" "}
          {/* key={city.name}: a new city remounts the span, so the pop animation plays again */}
          <span key={city.name} className="pop-in inline-block font-medium text-slate-200">
            {city.name}
          </span>
        </p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={cityDraft}
            onChange={(event) => setCityDraft(event.target.value)}
            placeholder="Search a city..."
            className={inputClass}
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-400 px-3 text-sm font-medium text-slate-950 hover:bg-violet-300"
          >
            Search
          </button>
        </form>

        {savedCity && (
          <p
            key={savedCity}
            className="pop-in mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-400 ring-1 ring-emerald-400/30"
          >
            ✓ Weather now shows {savedCity}
          </p>
        )}

        {isFetching && <p className="mt-3 text-sm text-slate-500">Searching...</p>}
        {isError && <p className="mt-3 text-sm text-red-400">Search failed. Try again.</p>}
        {results && results.length === 0 && !isFetching && (
          <p className="mt-3 text-sm text-slate-500">No cities found.</p>
        )}

        {results && results.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCity({
                      name: result.name,
                      latitude: result.latitude,
                      longitude: result.longitude,
                    });
                    setSearch("");
                    setCityDraft("");
                    // Show the confirmation for 4 seconds
                    setSavedCity([result.name, result.admin1].filter(Boolean).join(", "));
                    clearTimeout(hideTimeout.current);
                    hideTimeout.current = setTimeout(() => setSavedCity(null), 4000);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  {result.name}
                  <span className="text-slate-500">
                    {" "}
                    · {[result.admin1, result.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
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