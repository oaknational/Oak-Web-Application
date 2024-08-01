import { OakMaxWidth } from "@oaknational/oak-components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect } from "react";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";

const OnboardingPage: NextPage = () => {
  const ffEnabled = useFeatureFlagEnabled("use-auth-owa");
  const router = useRouter();

  useEffect(() => {
    if (ffEnabled === false) {
      router.replace("/404");
    }
  }, [ffEnabled, router]);

  return ffEnabled ? (
    <AppLayout
      seoProps={{ ...getSeoProps({}), ...{ noFollow: true, noIndex: true } }}
      $background="white"
    >
      <OakMaxWidth>
        <OnboardingView />
      </OakMaxWidth>
    </AppLayout>
  ) : null;
};

export default OnboardingPage;
