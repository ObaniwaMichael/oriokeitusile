import { cn } from "@/lib/utils";
import type { LiveStreamStatus } from "@/types";

export function LiveBadge({ status }: { status: LiveStreamStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
        <span className="size-2 rounded-full bg-white live-pulse" />
        Live
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        status === "upcoming" ? "bg-aqua/20 text-navy" : "bg-muted text-muted-foreground",
      )}
    >
      {status === "upcoming" ? "Upcoming" : "Replay"}
    </span>
  );
}
