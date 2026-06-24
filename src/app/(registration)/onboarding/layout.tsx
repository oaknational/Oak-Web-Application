"use client";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

import { Wall } from "@/components/AppComponents/Wall";

const OnboardingLayout = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <Wall />;
  if (!isSignedIn) return <RedirectToSignIn />;

  return <>{children}</>;
};

export default OnboardingLayout;
