"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

interface PlansTrackerProps {
  totalPlans: number;
}

export function PlansTracker({ totalPlans }: PlansTrackerProps) {
  useEffect(() => {
    events.plansViewed(totalPlans);
  }, [totalPlans]);

  return null;
}
