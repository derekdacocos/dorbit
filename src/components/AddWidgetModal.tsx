"use client";

import { WIDGETS } from "@/components/widgets";
import { useSettingsStore } from "@/stores/useSettingsStore";

type AddWidgetModalProps = {
  onClose: () => void;
};

export default function AddWidgetModal({ onClose }: AddWidgetModalProps) {
  const hidden = useSettingsStore((state) => state.hidden);
  const toggleHidden = useSettingsStore((state) => state.toggleHidden);

  const hiddenWidgets = WIDGETS.filter((widget) => hidden.includes(widget.id));

  return (
    // The dark layer behind the card. Clicking it closes the card.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-md rounded-3xl border border-white/10 p-6 text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add a widget</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 text-slate-400 hover:text-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {hiddenWidgets.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            All widgets are already on your dashboard. 🪐
            <br />
            Hide one with <span className="text-slate-200">Customize</span> to see it here.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {hiddenWidgets.map((widget) => (
              <li key={widget.id}>
                <button
                  type="button"
                  onClick={() => {
                    toggleHidden(widget.id); // un-hide it
                    if (hiddenWidgets.length === 1) onClose(); // that was the last one
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left hover:bg-white/10"
                >
                  <span className="text-2xl">{widget.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{widget.name}</span>
                    <span className="block text-xs text-slate-400">{widget.description}</span>
                  </span>
                  <span className="rounded-lg bg-violet-400 px-2.5 py-1 text-xs font-semibold text-slate-950">
                    + Add
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}