import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const intervalId = setInterval(onChange, 5 * 1000);
  return () => clearInterval(intervalId);
}

export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60000) * 60000,
    () => null
  );
}