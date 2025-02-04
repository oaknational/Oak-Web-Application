import { useUser } from "@clerk/nextjs";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useOnboardingStatus } from "../useOnboardingStatus";

const useOptionalDownloadSignUp = () => {
  // teacher-download-sign-in experiment A/B test groups
  const variantKey = z.literal("control").or(z.literal("with-buttons"));
  const featureFlag = useFeatureFlagVariantKey("teacher-download-sign-in");
  const parsedFeatureFlagKey = variantKey.safeParse(featureFlag);
  const optionalDownloadSignUpEnabled =
    parsedFeatureFlagKey.success &&
    parsedFeatureFlagKey.data === "with-buttons";

  const { isSignedIn, isLoaded } = useUser();
  const onboardingStatus = useOnboardingStatus();

  const [showDownloadSignUpButtons, setShowDownloadSignUpButtons] =
    useState(false);
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);

  useEffect(() => {
    setShowDownloadSignUpButtons(
      optionalDownloadSignUpEnabled &&
        isLoaded &&
        (!isSignedIn || (isSignedIn && onboardingStatus !== "onboarded")),
    );
    setShowTermsAgreement(
      optionalDownloadSignUpEnabled && isLoaded
        ? false
        : onboardingStatus === "not-onboarded" ||
            onboardingStatus === "unknown",
    );
  }, [optionalDownloadSignUpEnabled, isLoaded, isSignedIn, onboardingStatus]);

  return {
    showDownloadSignUpButtons,
    showTermsAgreement,
    setShowTermsAgreement,
  };
};

export default useOptionalDownloadSignUp;
