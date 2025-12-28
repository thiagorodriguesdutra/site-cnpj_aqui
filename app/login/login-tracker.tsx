"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

export function LoginTracker() {
  useEffect(() => {
    events.loginViewed();
  }, []);

  return null;
}
