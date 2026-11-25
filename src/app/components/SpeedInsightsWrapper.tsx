"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

export default function SpeedInsightsWrapper() {
  return (
    <SpeedInsights
      sampleRate={0.1}
      beforeSend={(data) => {
        if (!data.url.includes("teachers")) {
          return null;
        }
        return data;
      }}
    />
  );
}
