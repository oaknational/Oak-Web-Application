import { NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";
import toSafeRedirect from "@/common-lib/urls/toSafeRedirect";

const OnboardingComponent: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const [onboardingStatusChecked, setOnboardingStatusChecked] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      if (user.publicMetadata?.owa?.isOnboarded) {
        // Return the user to the page they originally arrived from
        // or to the home page as a fallback if they have already onboarded
        const returnTo = searchParams?.get("returnTo") ?? "/";
        router.push(
          toSafeRedirect(returnTo, new URL(globalThis.location.origin)) ?? "/",
        );
      } else {
        // if user requires onboarding update status to continue with the journey
        setOnboardingStatusChecked(true);
      }
    }
  }, [isLoaded, user, searchParams, router]);

  return onboardingStatusChecked ? <OnboardingView /> : null;
};

export default withPageAuthRequired(OnboardingComponent, Wall);
