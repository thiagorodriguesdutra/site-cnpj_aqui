"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

export function PageViewTracker() {
  useEffect(() => {
    events.landingViewed();
  }, []);

  return null;
}
