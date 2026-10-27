"use client";

import { useState, type FormEvent } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useLinksStore, type QuickLink } from "@/stores/useLinksStore";

export default function QuickLinks() {
  const links = useLinksStore((state) => state.links);
  const addLink = useLinksStore((state) => state.addLink);
  const updateLink = useLinksStore((state) => state.updateLink);
  const removeLink = useLinksStore((state) => state.removeLink);

  const mounted = useMounted();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  if (!mounted) {
    return <div className="mt-10 h-28" />;
  }

  function openAddForm() {
    setEditingId(null);
    setName("");
    setUrl("");
    setIsFormOpen(true);
  }

  function openEditForm(link: QuickLink) {
    setEditingId(link.id);
    setName(link.name);
    setUrl(link.url);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    let cleanUrl = url.trim();
    if (cleanName === "" || cleanUrl === "") return;

    if (!cleanUrl.startsWith("http")) {
      cleanUrl = "https://" + cleanUrl;
    }

    if (editingId) {
      updateLink(editingId, cleanName, cleanUrl);
    } else {
      addLink(cleanName, cleanUrl);
    }
    closeForm();
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap justify-center gap-4">
        {links.map((link) => (
          <div key={link.id} className="group relative">
            <a
              href={link.url}
              className="flex h-28 w-28 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 font-semibold">
                {link.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-slate-200">{link.name}</span>
            </a>

            <div className="absolute right-1.5 top-1.5 hidden gap-1 group-hover:flex">
              <button
                type="button"
                onClick={() => openEditForm(link)}
                className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300 hover:text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={openAddForm}
          className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 text-slate-400 transition hover:border-white/40 hover:text-white"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm">Add link</span>
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row"
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name (e.g. GitHub)"
            autoFocus
            className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
          />
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="URL (e.g. github.com)"
            className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-violet-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-violet-300"
            >
              {editingId ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}