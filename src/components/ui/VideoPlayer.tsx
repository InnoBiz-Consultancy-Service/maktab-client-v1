type VideoPlayerProps = {
  videoId: string | null;
};

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  if (!videoId) {
    return (
      <div className="rounded-lg border p-10 text-center">
        No video available.
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Lesson Video"
        allowFullScreen
      />
    </div>
  );
}