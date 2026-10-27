"use client";

import { useState, type FormEvent } from "react";

const engines = [
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
  { name: "GitHub", url: "https://github.com/search?q=" },
];

export default function SearchBar() {
  const [engineName, setEngineName] = useState("Google");
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim() === "") return;

    const engine = engines.find((e) => e.name === engineName);
    if (!engine) return;

    window.location.href = engine.url + encodeURIComponent(query.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-12 flex max-w-3xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 sm:flex-row sm:items-center"
    >
      <div className="flex gap-1 rounded-xl bg-slate-900/60 p-1">
        {engines.map((engine) => (
          <button
            key={engine.name}
            type="button"
            onClick={() => setEngineName(engine.name)}
            className={
              engine.name === engineName
                ? "rounded-lg bg-violet-400 px-4 py-2 text-sm font-medium text-slate-950"
                : "rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white"
            }
          >
            {engine.name}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${engineName}...`}
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none placeholder:text-slate-500"
      />

      <button
        type="submit"
        className="rounded-xl bg-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/20"
      >
        Search
      </button>
    </form>
  );
}