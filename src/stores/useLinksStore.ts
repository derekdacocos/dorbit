import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuickLink = {
  id: string;
  name: string;
  url: string;
};

type LinksState = {
  links: QuickLink[];
  addLink: (name: string, url: string) => void;
  updateLink: (id: string, name: string, url: string) => void;
  removeLink: (id: string) => void;
};

const defaultLinks: QuickLink[] = [
  { id: "github", name: "GitHub", url: "https://github.com" },
  { id: "youtube", name: "YouTube", url: "https://youtube.com" },
  { id: "vercel", name: "Vercel", url: "https://vercel.com" },
  { id: "claude", name: "Claude", url: "https://claude.ai" },
];

export const useLinksStore = create<LinksState>()(
  persist(
    (set) => ({
      links: defaultLinks,

      addLink: (name, url) =>
        set((state) => ({
          links: [...state.links, { id: crypto.randomUUID(), name, url }],
        })),

      updateLink: (id, name, url) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, name, url } : link
          ),
        })),

      removeLink: (id) =>
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        })),
    }),
    { name: "dorbit-links" }
  )
);