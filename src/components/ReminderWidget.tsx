"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import WidgetCard from "@/components/WidgetCard";
import { useMounted } from "@/hooks/useMounted";
import { playChime } from "@/lib/chime";
import { toDateKey } from "@/lib/dates";
import { useReminderStore } from "@/stores/useReminderStore";

// "17:30" -> "5:30 PM"
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
}

// The day buttons, Monday first. The number is JavaScript's day number (0 = Sunday).
const DAY_BUTTONS = [
  { day: 1, letter: "M", name: "Mon" },
  { day: 2, letter: "T", name: "Tue" },
  { day: 3, letter: "W", name: "Wed" },
  { day: 4, letter: "T", name: "Thu" },
  { day: 5, letter: "F", name: "Fri" },
  { day: 6, letter: "S", name: "Sat" },
  { day: 0, letter: "S", name: "Sun" },
];
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

// [1,2,3,4,5] -> "Mon–Fri", [] -> "Once", [1,3] -> "Mon, Wed"
function describeDays(days: number[]): string {
  const key = [...days].sort().join(",");
  if (key === "") return "Once";
  if (key === "0,1,2,3,4,5,6") return "Every day";
  if (key === "1,2,3,4,5") return "Mon–Fri";
  if (key === "0,6") return "Weekends";
  return DAY_BUTTONS.filter((button) => days.includes(button.day))
    .map((button) => button.name)
    .join(", ");
}

// How many minutes ago a "HH:MM" time was (negative = still to come)
function minutesLate(time: string, nowMinutes: number): number {
  const [hours, minutes] = time.split(":").map(Number);
  return nowMinutes - (hours * 60 + minutes);
}

export default function ReminderWidget() {
  const reminders = useReminderStore((state) => state.reminders);
  const addReminder = useReminderStore((state) => state.addReminder);
  const toggleReminder = useReminderStore((state) => state.toggleReminder);
  const removeReminder = useReminderStore((state) => state.removeReminder);

  const mounted = useMounted();
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<number[]>(EVERY_DAY);
  const [ringing, setRinging] = useState<string[]>([]); // labels ringing right now
  const [canNotify, setCanNotify] = useState(
    () => typeof Notification !== "undefined" && Notification.permission === "granted"
  );

  // Every 10 seconds: is it time for any reminder?
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const today = toDateKey(now);
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // getState() reads the latest reminders without restarting this timer
      const { reminders, markRang } = useReminderStore.getState();
      for (const reminder of reminders) {
        const due =
          reminder.on &&
          // Up to 5 minutes late is OK: Chrome checks background tabs less often
          minutesLate(reminder.time, nowMinutes) >= 0 &&
          minutesLate(reminder.time, nowMinutes) < 5 &&
          reminder.lastRang !== today &&
          (reminder.days.length === 0 || reminder.days.includes(now.getDay()));
        if (!due) continue;

        markRang(reminder.id, today);
        setRinging((current) => [...current, reminder.label]);
        playChime();
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("Dorbit reminder", { body: reminder.label });
        }
      }
    }, 10 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (label.trim() === "" || time === "") return;
    addReminder(label.trim(), time, days);
    setLabel("");
    setTime("");
    setDays(EVERY_DAY);
  }

  function toggleDay(day: number) {
    setDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    );
  }

  async function askToNotify() {
    const permission = await Notification.requestPermission();
    setCanNotify(permission === "granted");
  }

  const sorted = [...reminders].sort((a, b) => a.time.localeCompare(b.time));
  const inputClass =
    "rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 [color-scheme:dark] focus:ring-violet-400";

  return (
    <WidgetCard title="Reminders">
      {ringing.length > 0 && (
        <div className="pop-in mb-3 flex items-center justify-between gap-2 rounded-xl bg-violet-500/20 px-3 py-2 ring-1 ring-violet-400/40">
          <p className="text-sm font-medium">🔔 {ringing.join(", ")}</p>
          <button
            type="button"
            onClick={() => setRinging([])}
            className="rounded-lg bg-violet-400 px-2 py-1 text-xs font-semibold text-slate-950 hover:bg-violet-300"
          >
            OK
          </button>
        </div>
      )}

      {mounted && (
        <ul className="flex flex-1 flex-col gap-2">
          {sorted.length === 0 && (
            <li className="text-sm text-slate-500">
              Shift start, breaks, drinking water... add a reminder below and Dorbit chimes on time.
            </li>
          )}
          {sorted.map((reminder) => (
            <li
              key={reminder.id}
              className="group flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={reminder.on}
                onChange={() => toggleReminder(reminder.id)}
                className="h-4 w-4 accent-violet-400"
                aria-label={reminder.on ? "Turn off" : "Turn on"}
              />
              <div className={`min-w-0 flex-1 ${reminder.on ? "" : "opacity-40"}`}>
                <p className="truncate text-sm font-medium">{reminder.label}</p>
                <p className="text-xs text-slate-500">
                  {formatTime(reminder.time)} · {describeDays(reminder.days)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeReminder(reminder.id)}
                className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
                aria-label={`Remove ${reminder.label}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {mounted && !canNotify && typeof Notification !== "undefined" && (
        <button
          type="button"
          onClick={askToNotify}
          className="mt-3 self-start text-xs text-violet-300 hover:text-violet-200"
        >
          🔔 Also show pop-up alerts
        </button>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Reminder (e.g. Break time)"
            className={inputClass + " min-w-0 flex-1"}
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-400 px-3 text-lg font-medium text-slate-950 hover:bg-violet-300"
          >
            +
          </button>
        </div>
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className={inputClass}
          aria-label="Time"
        />
        {/* Pick the days it rings. None picked = rings once. */}
        <div className="flex items-center justify-between gap-1">
          {DAY_BUTTONS.map((button) => (
            <button
              key={button.day}
              type="button"
              onClick={() => toggleDay(button.day)}
              aria-label={button.name}
              aria-pressed={days.includes(button.day)}
              className={
                days.includes(button.day)
                  ? "h-7 w-7 rounded-full bg-violet-400 text-xs font-semibold text-slate-950"
                  : "h-7 w-7 rounded-full bg-white/5 text-xs text-slate-400 ring-1 ring-white/10 hover:bg-white/10"
              }
            >
              {button.letter}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">Repeats: {describeDays(days)}</p>
      </form>
    </WidgetCard>
  );
}