// Turns a normal YouTube or Spotify link into a link that can be shown in an iframe.
// Returns null if the link isn't one we understand.
export function toEmbedUrl(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }

  // https://www.youtube.com/watch?v=VIDEO_ID
  if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
    return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
  }

  // https://youtu.be/VIDEO_ID
  if (url.hostname === "youtu.be") {
    return `https://www.youtube.com/embed${url.pathname}`;
  }

  // https://open.spotify.com/playlist/ID (also album/track)
  if (url.hostname === "open.spotify.com") {
    const match = url.pathname.match(/\/(playlist|album|track)\/([A-Za-z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
  }

  return null;
}