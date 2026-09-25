// Returns an embeddable YouTube URL for the common link shapes admins paste
// (watch?v=, youtu.be/, /shorts/, /embed/), or null for anything else.
export function youtubeEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
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
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
