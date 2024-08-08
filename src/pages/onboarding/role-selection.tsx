import {
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect } from "react";

import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view";

const RoleSelectionPage = () => {
  const ffEnabled = useFeatureFlagEnabled("use-auth-owa");
  const router = useRouter();

  // TODO: extract into shared hook
  useEffect(() => {
    if (ffEnabled === false) {
      router.replace("/404");
    }
  }, [ffEnabled, router]);

  return ffEnabled ? (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        <RoleSelectionView />
      </OakMaxWidth>
    </OakThemeProvider>
  ) : null;
};

export default RoleSelectionPage;
