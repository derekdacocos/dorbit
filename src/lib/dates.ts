const DAY_MS = 24 * 60 * 60 * 1000;

// Turns a Date into a "YYYY-MM-DD" key, using your local time zone
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Moves a "YYYY-MM-DD" key forward (or back, with a negative number) by some days
export function addDays(dateKey: string, days: number): string {
  return new Date(Date.parse(dateKey) + days * DAY_MS).toISOString().slice(0, 10);
}

// How many days from one "YYYY-MM-DD" key to another
export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((Date.parse(toKey) - Date.parse(fromKey)) / DAY_MS);
}

// "Mon", "Tue", ... for a "YYYY-MM-DD" key
export function weekdayLabel(dateKey: string): string {
  return new Date(dateKey + "T00:00").toLocaleDateString("en-US", { weekday: "short" });
}