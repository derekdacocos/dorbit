"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { useUser } from "@/hooks/useUser";
import { auth, googleProvider } from "@/lib/firebase";

export default function AccountButton({ className }: { className: string }) {
  const user = useUser();

  if (!user) {
    return (
      <button type="button" onClick={() => signInWithPopup(auth, googleProvider)} className={className}>
        Sign in to sync
      </button>
    );
  }

  const firstName = user.displayName?.split(" ")[0] ?? "Account";

  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm("Sign out? Your data stays on this device, it just stops syncing.")) {
          signOut(auth);
        }
      }}
      className={className}
      title="Signed in. Click to sign out."
    >
      ☁️ {firstName}
    </button>
  );
}