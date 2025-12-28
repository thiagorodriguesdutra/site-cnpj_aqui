"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

interface BlogTrackerProps {
  slug: string;
}

export function BlogTracker({ slug }: BlogTrackerProps) {
  useEffect(() => {
    events.blogViewed(slug);
  }, [slug]);

  return null;
}
