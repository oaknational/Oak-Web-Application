"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";

const withFeatureFlag = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureFlag: string,
) => {
  const WithFeatureFlag: React.FC<P> = (props) => {
    const ffEnabled = useFeatureFlagEnabled(featureFlag);
    const router = useRouter();

    useEffect(() => {
      if (ffEnabled === false) {
        router.replace("/404");
      }
    }, [ffEnabled, router]);

    if (!ffEnabled) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithFeatureFlag;
};

export default withFeatureFlag;
