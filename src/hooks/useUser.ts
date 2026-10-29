import { useSyncExternalStore } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

function subscribe(onChange: () => void) {
  return onAuthStateChanged(auth, onChange);
}

export function useUser() {
  return useSyncExternalStore(
    subscribe,
    () => auth.currentUser,
    () => null
  );
}