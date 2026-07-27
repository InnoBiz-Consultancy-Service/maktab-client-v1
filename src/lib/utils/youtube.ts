const ID = /^[a-zA-Z0-9_-]{11}$/;

const PATTERNS: RegExp[] = [
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  /[?&]v=([a-zA-Z0-9_-]{11})/,
];

export function extractYouTubeId(
  input: string | null | undefined,
): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (ID.test(raw)) return raw;
  for (const p of PATTERNS) {
    const m = raw.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function youTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
