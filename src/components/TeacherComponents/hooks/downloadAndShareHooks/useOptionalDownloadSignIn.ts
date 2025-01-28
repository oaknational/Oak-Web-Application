import { useUser } from "@clerk/nextjs";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useOnboardingStatus } from "../useOnboardingStatus";

const useOptionalDownloadSignIn = () => {
  // teacher-download-sign-in experiment A/B test groups
  const variantKey = z.literal("control").or(z.literal("with-buttons"));
  const featureFlag = useFeatureFlagVariantKey("teacher-download-sign-in");
  const parsedFeatureFlagKey = variantKey.safeParse(featureFlag);
  const optionalDownloadSignInEnabled =
    parsedFeatureFlagKey.success &&
    parsedFeatureFlagKey.data === "with-buttons";

  const { isSignedIn, isLoaded } = useUser();
  const onboardingStatus = useOnboardingStatus();

  const [showDownloadSignInButtons, setShowDownloadSignInButtons] =
    useState(false);
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);

  useEffect(() => {
    setShowDownloadSignInButtons(
      optionalDownloadSignInEnabled &&
        isLoaded &&
        (!isSignedIn || (isSignedIn && onboardingStatus !== "onboarded")),
    );
    setShowTermsAgreement(
      optionalDownloadSignInEnabled && isLoaded
        ? false
        : onboardingStatus === "not-onboarded" ||
            onboardingStatus === "unknown",
    );
  }, [optionalDownloadSignInEnabled, isLoaded, isSignedIn, onboardingStatus]);

  return {
    showDownloadSignInButtons,
    showTermsAgreement,
    setShowTermsAgreement,
  };
};

export default useOptionalDownloadSignIn;
