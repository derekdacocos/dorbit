"use client";

import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCities, type CityResult } from "@/lib/geocoding";

type CitySearchProps = {
  onPick: (city: CityResult) => void; // what to do with the city you click
  placeholder?: string;
};

// A search box + results list. Used by Settings, the welcome screen and World clocks.
export default function CitySearch({ onPick, placeholder = "Search a city..." }: CitySearchProps) {
  const [cityDraft, setCityDraft] = useState("");
  const [search, setSearch] = useState(""); // the search we actually run

  // Only searches once you press Search (enabled: false = wait)
  const { data: results, isFetching, isError } = useQuery({
    queryKey: ["cities", search],
    queryFn: () => searchCities(search),
    enabled: search !== "",
  });

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(cityDraft.trim());
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={cityDraft}
          onChange={(event) => setCityDraft(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-400 px-3 text-sm font-medium text-slate-950 hover:bg-violet-300"
        >
          Search
        </button>
      </form>

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
                  onPick(result);
                  setSearch("");
                  setCityDraft("");
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
    </div>
  );
}