"use client";

import { useEffect } from "react";
import { events } from "@/lib/analytics/umami";

interface ValidationTrackerProps {
  documentId: string;
  source?: string;
}

export function ValidationTracker({
  documentId,
  source,
}: ValidationTrackerProps) {
  useEffect(() => {
    events.validationPageAccessed(documentId, source);

    if (source === "qr") {
      events.qrCodeScanned(documentId);
    }

    events.documentValidated(documentId);
  }, [documentId, source]);

  return null;
}
