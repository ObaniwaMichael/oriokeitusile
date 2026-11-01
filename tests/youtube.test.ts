import { describe, expect, it } from "vitest";

import { extractYouTubeId, youtubeEmbedUrl } from "@/lib/youtube/parse";

describe("extractYouTubeId", () => {
  const id = "dQw4w9WgXcQ";

  it("parses watch, short, live, embed, and nocookie URLs", () => {
    const urls = [
      `https://www.youtube.com/watch?v=${id}`,
      `https://youtu.be/${id}`,
      `https://youtube.com/live/${id}`,
      `https://www.youtube.com/embed/${id}`,
      `https://www.youtube-nocookie.com/embed/${id}`,
      `https://m.youtube.com/watch?v=${id}&feature=share`,
      id,
    ];
    for (const url of urls) {
      expect(extractYouTubeId(url)).toBe(id);
    }
  });

  it("rejects invalid URLs", () => {
    expect(extractYouTubeId("https://vimeo.com/123")).toBeNull();
    expect(extractYouTubeId("not a url")).toBeNull();
    expect(extractYouTubeId("")).toBeNull();
  });

  it("builds a nocookie embed URL", () => {
    expect(youtubeEmbedUrl(id)).toBe(`https://www.youtube-nocookie.com/embed/${id}`);
  });
});
