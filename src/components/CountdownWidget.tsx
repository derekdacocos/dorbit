"use client";

import { useState, type FormEvent } from "react";
import WidgetCard from "@/components/WidgetCard";
import { useToday } from "@/hooks/useToday";
import { daysBetween } from "@/lib/dates";
import { useCountdownStore } from "@/stores/useCountdownStore";

export default function CountdownWidget() {
  const countdowns = useCountdownStore((state) => state.countdowns);
  const addCountdown = useCountdownStore((state) => state.addCountdown);
  const removeCountdown = useCountdownStore((state) => state.removeCountdown);

  const today = useToday();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim() === "" || date === "") return;
    addCountdown(title.trim(), date);
    setTitle("");
    setDate("");
  }

  const sorted = [...countdowns].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <WidgetCard title="Countdowns">
      {today !== null && (
        <ul className="flex flex-1 flex-col gap-2">
          {sorted.length === 0 && (
            <li className="text-sm text-slate-500">No countdowns yet. Add an event below.</li>
          )}
          {sorted.map((countdown) => {
            const daysLeft = daysBetween(today, countdown.date);
            return (
              <li
                key={countdown.id}
                className="group flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{countdown.title}</p>
                  <p className="text-xs text-slate-500">{countdown.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-semibold text-violet-300">
                      {daysLeft >= 0 ? daysLeft : "Done"}
                    </p>
                    {daysLeft >= 0 && (
                      <p className="text-xs text-slate-500">{daysLeft === 1 ? "day" : "days"}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCountdown(countdown.id)}
                    className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Event (e.g. Payday)"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 [color-scheme:dark] focus:ring-violet-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-400 px-3 text-lg font-medium text-slate-950 hover:bg-violet-300"
          >
            +
          </button>
        </div>
      </form>
    </WidgetCard>
  );
}