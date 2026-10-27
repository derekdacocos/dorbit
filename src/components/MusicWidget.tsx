"use client";

import { useState, type FormEvent } from "react";
import WidgetCard from "@/components/WidgetCard";
import { useMounted } from "@/hooks/useMounted";
import { toEmbedUrl } from "@/lib/embeds";
import { useMusicStore } from "@/stores/useMusicStore";

export default function MusicWidget() {
  const link = useMusicStore((state) => state.link);
  const setLink = useMusicStore((state) => state.setLink);

  const mounted = useMounted();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (toEmbedUrl(draft) === null) {
      setError("Paste a YouTube video or Spotify playlist link.");
      return;
    }
    setLink(draft.trim());
    setDraft("");
    setError("");
  }

  const embedUrl = toEmbedUrl(link);
  const isSpotify = embedUrl?.includes("spotify") ?? false;

  return (
    <WidgetCard title="Music" className={isSpotify ? "sm:col-span-2" : ""}>
      <div
        className={`overflow-hidden rounded-xl bg-slate-900 ${
            isSpotify ? "h-[152px]" : "aspect-video"
        }`}
    >
        {mounted && embedUrl && (
          <iframe
            src={embedUrl}
            title="Music player"
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-auto flex gap-2 pt-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Paste a YouTube or Spotify link"
          className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-400 px-3 text-sm font-medium text-slate-950 hover:bg-violet-300"
        >
          Play
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </WidgetCard>
  );
}