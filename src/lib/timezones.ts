// "9:41 PM" in another time zone
export function formatTimeIn(time: number, timeZone: string): string {
  return new Date(time).toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
}

// The wall-clock time in a time zone, as if it were UTC. Comparing two of these
// tells you how many hours apart two places are.
function wallClock(time: number, timeZone?: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date(time));
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
}

// How a place compares to you: "Thu · 12 hrs behind", "Sat · 3 hrs ahead", "Same time as you"
export function compareToYou(time: number, timeZone: string): string {
  const hours = (wallClock(time, timeZone) - wallClock(time)) / (60 * 60 * 1000);
  if (hours === 0) return "Same time as you";

  const day = new Date(time).toLocaleDateString("en-US", { timeZone, weekday: "short" });
  const amount = Math.abs(hours);
  const unit = amount === 1 ? "hr" : "hrs";
  return `${day} · ${amount} ${unit} ${hours > 0 ? "ahead" : "behind"}`;
}