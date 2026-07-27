import { AlertCircle } from "lucide-react";

interface YouTubeEmbedProps {
  url: string;
  className?: string;
}

export function YouTubeEmbed({ url, className }: YouTubeEmbedProps) {
  const videoId = parseYoutubeId(url);

  if (!videoId) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-error/10 p-3 text-sm text-error">
        <AlertCircle className="h-4 w-4" />
        <span>Invalid YouTube URL format</span>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className={`relative w-full overflow-hidden rounded-md bg-night-900 shadow-soft ${className}`} style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute top-0 left-0 h-full w-full border-0"
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function parseYoutubeId(url: string): string | null {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
}
