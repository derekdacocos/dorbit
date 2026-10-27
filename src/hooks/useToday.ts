import { useSyncExternalStore } from "react";
import { toDateKey } from "@/lib/dates";

function subscribe(onChange: () => void) {
  const intervalId = setInterval(onChange, 60 * 1000);
  return () => clearInterval(intervalId);
}

// Today's date as "YYYY-MM-DD" (null while the server renders). Updates after midnight.
export function useToday() {
  return useSyncExternalStore(
    subscribe,
    () => toDateKey(new Date()),
    () => null
  );
}