"use client";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { Wall } from "@/components/AppComponents/Wall";
import { OnboardingLayout as OnboardingLayoutFrame } from "@/components/TeacherComponents/OnboardingLayout/OnboardingLayout";

type OnboardingPrompt = {
  promptHeading: ReactNode;
  promptBody: ReactNode;
};

const accountSetupBody =
  "We need a few more details to complete your account setup.";

const defaultPrompt: OnboardingPrompt = {
  promptHeading: <>Nearly done&hellip;</>,
  promptBody: accountSetupBody,
};

const onboardingPrompts: Record<string, OnboardingPrompt> = {
  "/onboarding": defaultPrompt,
  "/onboarding/school-selection": defaultPrompt,
  "/onboarding/role-selection": {
    promptHeading: <>Last step&hellip;</>,
    promptBody: accountSetupBody,
  },
  "/onboarding/how-can-oak-support-you": {
    promptHeading: "Last step...",
    promptBody:
      "Tell us a little bit about you so we can tailor Oak to suit your needs.",
  },
};

const OnboardingLayout = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) return <Wall />;
  if (!isSignedIn) return <RedirectToSignIn />;

  const prompt = onboardingPrompts[pathname ?? ""] ?? defaultPrompt;

  return (
    <OnboardingLayoutFrame
      promptHeading={prompt.promptHeading}
      promptBody={prompt.promptBody}
    >
      {children}
    </OnboardingLayoutFrame>
  );
};

export default OnboardingLayout;
