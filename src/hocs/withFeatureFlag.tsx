"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeatureFlagVariantKey } from "posthog-js/react";

const withFeatureFlag = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureFlag: string,
  featureFlagVariant: string | true = true,
) => {
  const WithFeatureFlag: React.FC<P> = (props) => {
    const flagValue = useFeatureFlagVariantKey(featureFlag);
    const flagLoaded = flagValue !== undefined;
    const ffEnabled = flagValue === featureFlagVariant;
    const router = useRouter();
    useEffect(() => {
      if (flagLoaded && !ffEnabled) {
        router.replace("/404");
      }
    }, [flagLoaded, ffEnabled, router]);

    if (!flagLoaded || !ffEnabled) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  return WithFeatureFlag;
};

export default withFeatureFlag;
