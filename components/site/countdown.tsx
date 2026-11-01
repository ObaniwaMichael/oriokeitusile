"use client";

import { useEffect, useState } from "react";

function parts(target: number) {
  const diff = Math.max(0, target - Date.now());
  const totalMinutes = Math.floor(diff / 60000);
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor(totalMinutes / 60) % 24,
    minutes: totalMinutes % 60,
  };
}

export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [time, setTime] = useState(() => parts(target));

  useEffect(() => {
    const id = window.setInterval(() => setTime(parts(target)), 30000);
    return () => window.clearInterval(id);
  }, [target]);

  if (Date.now() >= target) {
    return <p className="text-sm text-muted-foreground">Starting soon.</p>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Starts in {time.days}d {time.hours}h {time.minutes}m
    </p>
  );
}
