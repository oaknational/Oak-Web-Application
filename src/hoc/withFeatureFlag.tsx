import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

const withFeatureFlag = (
  WrappedComponent: React.ComponentType,
  featureFlag: string,
) => {
  const WithFeatureFlag: React.FC = (props) => {
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

    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakMaxWidth>
          <WrappedComponent {...props} />
        </OakMaxWidth>
      </OakThemeProvider>
    );
  };

  return WithFeatureFlag;
};

export default withFeatureFlag;
