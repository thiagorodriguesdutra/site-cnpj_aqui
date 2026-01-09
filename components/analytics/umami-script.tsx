import Script from "next/script";

import { publicEnv } from "@/lib/env.public";

export function UmamiScript({ nonce }: { nonce?: string }) {
  const websiteId = publicEnv.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiUrl = publicEnv.NEXT_PUBLIC_UMAMI_URL;

  if (!websiteId || !umamiUrl) {
    return null;
  }

  return (
    <Script
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="lazyOnload"
      nonce={nonce}
    />
  );
}
