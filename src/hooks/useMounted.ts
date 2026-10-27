import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

// false while the server renders (and during hydration), true in the browser after that
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}