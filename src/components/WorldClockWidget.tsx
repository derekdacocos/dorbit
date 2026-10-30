"use client";

import { useState } from "react";
import CitySearch from "@/components/CitySearch";
import WidgetCard from "@/components/WidgetCard";
import { useNow } from "@/hooks/useNow";
import { compareToYou, formatTimeIn } from "@/lib/timezones";
import { useWorldClockStore } from "@/stores/useWorldClockStore";

export default function WorldClockWidget() {
  const clocks = useWorldClockStore((state) => state.clocks);
  const addClock = useWorldClockStore((state) => state.addClock);
  const removeClock = useWorldClockStore((state) => state.removeClock);

  const now = useNow();
  const [adding, setAdding] = useState(false);

  return (
    <WidgetCard title="World clocks">
      {now !== null && (
        <ul className="flex flex-1 flex-col gap-2">
          {clocks.length === 0 && !adding && (
            <li className="text-sm text-slate-500">
              See the time for family, friends or clients abroad. Add a city below.
            </li>
          )}
          {clocks.map((clock) => (
            <li
              key={clock.id}
              className="group flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" title={clock.place}>
                  {clock.name}
                </p>
                <p className="text-xs text-slate-500">{compareToYou(now, clock.timeZone)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-semibold whitespace-nowrap text-violet-300 tabular-nums">
                  {formatTimeIn(now, clock.timeZone)}
                </p>
                <button
                  type="button"
                  onClick={() => removeClock(clock.id)}
                  className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
                  aria-label={`Remove ${clock.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <div className="mt-4">
          <CitySearch
            placeholder="City (e.g. New York)"
            onPick={(result) => {
              if (!result.timezone) return; // rare: no time zone for this place
              addClock(result.name, result.country ?? "", result.timezone);
              setAdding(false);
            }}
          />
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="mt-2 text-xs text-slate-500 hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-4 rounded-lg bg-white/5 py-2 text-sm text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
        >
          + Add a city
        </button>
      )}
    </WidgetCard>
  );
}