import { youtubeEmbedUrl } from "@/lib/youtube/parse";

export function YoutubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-navy card-shadow">
      <iframe
        title={title}
        src={youtubeEmbedUrl(id)}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
