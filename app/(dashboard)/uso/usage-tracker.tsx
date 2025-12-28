"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

interface UsageTrackerProps {
  availableCredits: number;
  totalUsed: number;
}

export function UsageTracker({
  availableCredits,
  totalUsed,
}: UsageTrackerProps) {
  useEffect(() => {
    events.usageViewed(availableCredits, totalUsed);
  }, [availableCredits, totalUsed]);

  return null;
}
