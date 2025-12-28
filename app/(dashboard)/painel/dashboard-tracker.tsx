"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

interface DashboardTrackerProps {
  availableCredits: number;
}

export function DashboardTracker({ availableCredits }: DashboardTrackerProps) {
  useEffect(() => {
    events.dashboardViewed(availableCredits);

    const hasTrackedLoginKey = "cnpjaqui_login_tracked";
    if (!sessionStorage.getItem(hasTrackedLoginKey)) {
      events.loginSuccess("google");
      sessionStorage.setItem(hasTrackedLoginKey, "true");
    }
  }, [availableCredits]);

  return null;
}
