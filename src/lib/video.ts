// Admins often paste links without the scheme, e.g. "youtube.com/watch?v=…".
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  return /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// "186", "186s" or "3m6s" → seconds
function parseStart(value: string | null): number {
  if (!value) return 0;
  if (/^\d+s?$/.test(value)) return parseInt(value, 10);
  const m = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

// Returns an embeddable YouTube URL for the common link shapes admins paste
// (watch?v=, youtu.be/, /shorts/, /embed/), or null for anything else.
export function youtubeEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(normalizeUrl(url));
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = parsed.pathname.slice(1);
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") id = parsed.searchParams.get("v");
    else {
      const match = parsed.pathname.match(/^\/(shorts|embed|live)\/([^/]+)/);
      if (match) id = match[2];
    }
  }

  if (!id || !/^[\w-]{6,}$/.test(id)) return null;
  const start = parseStart(
    parsed.searchParams.get("t") ?? parsed.searchParams.get("start") ?? parsed.searchParams.get("time_continue")
  );
  return `https://www.youtube-nocookie.com/embed/${id}${start > 0 ? `?start=${start}` : ""}`;
}
