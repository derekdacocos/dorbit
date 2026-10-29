"use client";

import { useState } from "react";

type SignInModalProps = {
  onClose: () => void;
  onSignIn: () => Promise<string>; // signs in and gives back the first name
};

export default function SignInModal({ onClose, onSignIn }: SignInModalProps) {
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function handleSignIn() {
    setFailed(false);
    try {
      const firstName = await onSignIn();
      setWelcomeName(firstName);
      setTimeout(onClose, 2500); // show the welcome for a moment, then close
    } catch {
      setFailed(true); // popup closed or blocked
    }
  }

  const welcomed = welcomeName !== null;

  return (
    // The dark layer behind the card. Clicking it closes the card.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 p-8 text-center text-white"
        onClick={(event) => event.stopPropagation()}
      >
        {/* The rocket waits below the planet, and lands on top of it once you're signed in */}
        <div className="relative mx-auto mb-6 h-36 w-36">
          <div className="signout-orbit absolute inset-0 rounded-full border border-dashed border-violet-300/40">
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-200 shadow-[0_0_12px_#c4b5fd]" />
          </div>
          <div className="absolute inset-8 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-700 text-4xl font-bold text-white shadow-[0_0_40px_rgba(167,139,250,0.5)]">
            {welcomed ? welcomeName.charAt(0).toUpperCase() : "☁️"}
          </div>
          <span className={`absolute right-0 bottom-0 text-3xl ${welcomed ? "rocket-land" : "float"}`}>🚀</span>
        </div>

        {welcomed ? (
          <>
            <h2 className="text-xl font-semibold">Welcome aboard, {welcomeName}! 🪐</h2>
            <p className="mt-2 text-sm text-slate-400">Your dashboard is now synced to the cloud.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Ready for launch?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to keep your to-dos, notes and layout in sync on every device.
            </p>
            {failed && <p className="mt-3 text-sm text-rose-400">Sign-in didn&apos;t finish. Try again?</p>}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm ring-1 ring-white/15 hover:bg-white/10"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={handleSignIn}
                className="flex-1 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"
              >
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}