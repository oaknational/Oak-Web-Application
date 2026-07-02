"use client";
import { RedirectToSignUp, useUser } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect } from "react";

import { Wall } from "@/components/AppComponents/Wall";
import { OnboardingLayout as OnboardingLayoutFrame } from "@/components/TeacherComponents/OnboardingLayout/OnboardingLayout";
import toSafeRedirect from "@/common-lib/urls/toSafeRedirect";

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

const OnboardingLayoutInner = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOnboarded = Boolean(user?.publicMetadata?.owa?.isOnboarded);

  useEffect(() => {
    if (isLoaded && isSignedIn && isOnboarded) {
      // Return already-onboarded users to where they came from (or home)
      const returnTo = searchParams?.get("returnTo") ?? "/";
      router.replace(
        toSafeRedirect(returnTo, new URL(globalThis.location.origin)) ?? "/",
      );
    }
  }, [isLoaded, isSignedIn, isOnboarded, searchParams, router]);

  if (!isLoaded) return <Wall />;
  if (!isSignedIn) return <RedirectToSignUp />;
  // Avoid flashing the onboarding UI while redirecting onboarded users away
  if (isOnboarded) return <Wall />;

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

const OnboardingLayout = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={null}>
    <OnboardingLayoutInner>{children}</OnboardingLayoutInner>
  </Suspense>
);

export default OnboardingLayout;
