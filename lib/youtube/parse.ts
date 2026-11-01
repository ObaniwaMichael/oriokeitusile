const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

const ID_MARKERS = new Set(["embed", "live", "shorts", "v", "watch"]);

export function isYouTubeVideoId(id: string): boolean {
  return /^[\w-]{11}$/.test(id);
}

export function extractYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (isYouTubeVideoId(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.split("?")[0] ?? "";
      return isYouTubeVideoId(id) ? id : null;
    }

    if (!YOUTUBE_HOSTS.has(host)) {
      return null;
    }

    const fromQuery = url.searchParams.get("v");
    if (fromQuery && isYouTubeVideoId(fromQuery)) {
      return fromQuery;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    for (let index = 0; index < parts.length; index += 1) {
      if (ID_MARKERS.has(parts[index]) && parts[index + 1] && isYouTubeVideoId(parts[index + 1])) {
        return parts[index + 1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
