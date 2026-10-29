"use client";

import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { useUser } from "@/hooks/useUser";
import { auth, googleProvider } from "@/lib/firebase";
import SignInModal from "@/components/SignInModal";
import SignOutModal from "@/components/SignOutModal";

export default function AccountButton({ className }: { className: string }) {
  const user = useUser();
  const [modal, setModal] = useState<"signIn" | "signOut" | null>(null);

  const firstName = user?.displayName?.split(" ")[0] ?? "Account";

  return (
    <>
      {user ? (
        <button type="button" onClick={() => setModal("signOut")} className={className} title="Signed in. Click to sign out.">
          ☁️ {firstName}
        </button>
      ) : (
        <button type="button" onClick={() => setModal("signIn")} className={className}>
          Sign in to sync
        </button>
      )}

      {/* The modals sit outside the buttons above, so they stay open while you go from signed out to signed in */}
      {modal === "signIn" && (
        <SignInModal
          onClose={() => setModal(null)}
          onSignIn={async () => {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user.displayName?.split(" ")[0] ?? "friend";
          }}
        />
      )}
      {modal === "signOut" && (
        <SignOutModal
          name={firstName}
          onClose={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            signOut(auth);
          }}
        />
      )}
    </>
  );
}