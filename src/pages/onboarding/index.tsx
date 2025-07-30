import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  OakBox,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { useUser } from "@clerk/nextjs";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";

const OnboardingComponent: NextPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-up");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakBox $background={"bg-decorative1-main"} />
      </OakThemeProvider>
    );
  }

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OnboardingView />
    </OakThemeProvider>
  );
};

export default OnboardingComponent;
