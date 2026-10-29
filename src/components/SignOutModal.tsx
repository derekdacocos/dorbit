"use client";

import { useState } from "react";

type SignOutModalProps = {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SignOutModal({ name, onClose, onConfirm }: SignOutModalProps) {
  const [launching, setLaunching] = useState(false);

  function handleLaunch() {
    setLaunching(true);
    // Let the rocket fly away first, then really sign out
    setTimeout(onConfirm, 1400);
  }

  return (
    // The dark layer behind the card. Clicking it closes the card (not during lift-off).
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={launching ? undefined : onClose}
    >
      <div
        className={`glass w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 p-8 text-center text-white ${launching ? "card-launch" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* A little planet with your initial, a moon orbiting it, and a rocket ready to go */}
        <div className="relative mx-auto mb-6 h-36 w-36">
          <div className="signout-orbit absolute inset-0 rounded-full border border-dashed border-violet-300/40">
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-200 shadow-[0_0_12px_#c4b5fd]" />
          </div>
          <div className="absolute inset-8 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-700 text-4xl font-bold text-white shadow-[0_0_40px_rgba(167,139,250,0.5)]">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className={`absolute right-0 bottom-0 text-3xl ${launching ? "rocket-launch" : ""}`}>🚀</span>
        </div>

        <h2 className="text-xl font-semibold">
          {launching ? "Lift-off! See you soon ✨" : `Leaving orbit, ${name}?`}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Your dashboard stays on this device. Syncing pauses until you sign back in.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={launching}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm ring-1 ring-white/15 hover:bg-white/10 disabled:opacity-40"
          >
            Stay in orbit
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            disabled={launching}
            className="flex-1 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-40"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}