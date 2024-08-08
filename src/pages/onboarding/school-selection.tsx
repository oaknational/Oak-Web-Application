import {
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect } from "react";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";

const SchoolSelectionPage: NextPage = () => {
  const ffEnabled = useFeatureFlagEnabled("use-auth-owa");
  const router = useRouter();

  useEffect(() => {
    if (ffEnabled === false) {
      router.replace("/404");
    }
  }, [ffEnabled, router]);

  return ffEnabled ? (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        <OnboardingView />
      </OakMaxWidth>
    </OakThemeProvider>
  ) : null;
};

export default SchoolSelectionPage;
