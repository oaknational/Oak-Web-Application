import { useEffect, useState } from "react";
import { OakInlineBanner } from "@oaknational/oak-components";
import { useFeatureFlagEnabled, usePostHog } from "posthog-js/react";

export function NeverDownloadedBanner({
  context,
}: Readonly<{
  context: "lesson" | "unit" | "curriculum";
}>) {
  const posthog = usePostHog();
  const flagEnabled = useFeatureFlagEnabled("never-downloaded-banner");

  const [shouldShow, setShouldShow] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Once we have the feature flag value, capture it in state
    if (shouldShow === undefined && flagEnabled !== undefined) {
      setShouldShow(flagEnabled);
    }
  }, [flagEnabled, shouldShow]);

  useEffect(() => {
    // The user has seen the banner, let's make sure they don't see it again
    if (shouldShow) {
      posthog?.setPersonProperties({ has_seen_download_banner: true });
    }
  }, [shouldShow, posthog]);

  if (!shouldShow) return;
  return (
    <OakInlineBanner
      isOpen={true}
      title="Downloading is quick and easy"
      message={`You can download this ${context} by just pressing the little download button btw!`}
      type="info"
    />
  );
}
