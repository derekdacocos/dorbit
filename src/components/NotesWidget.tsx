"use client";

import { useEffect, useState } from "react";
import WidgetCard from "@/components/WidgetCard";
import { useMounted } from "@/hooks/useMounted";
import { useNotesStore } from "@/stores/useNotesStore";

function NotesEditor() {
  const saveText = useNotesStore((state) => state.saveText);
  const [text, setText] = useState(() => useNotesStore.getState().text);
  const [status, setStatus] = useState("Saved");

  // Debounce: wait until you stop typing for 0.5s, then save once
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveText(text);
      setStatus("Saved");
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [text, saveText]);

  return (
    <>
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setStatus("Saving...");
        }}
        placeholder="Write anything..."
        className="flex-1 resize-none rounded-xl bg-slate-900/60 p-3 text-sm leading-relaxed outline-none ring-1 ring-white/10 focus:ring-violet-400"
      />
      <p className="mt-2 text-xs text-slate-500">{status}</p>
    </>
  );
}

export default function NotesWidget() {
  const mounted = useMounted();
  const cloudVersion = useNotesStore((state) => state.cloudVersion);

  return (
    <WidgetCard title="Notes">{mounted && <NotesEditor key={cloudVersion} />}</WidgetCard>
  );
}