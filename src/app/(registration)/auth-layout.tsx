"use client";
import { useCallback, useEffect, useState } from "react";

import { resolveOakHref } from "@/common-lib/urls";
import { RegistrationLayout } from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import { OakBox, OakLink, OakP } from "@/styles/oakThemeApp";

const TermsAndConditions = () => {
  return (
    <OakBox>
      <OakP $font="body-2" color="text-primary" $textAlign="center">
        By continuing you are agreeing to Oak's{" "}
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
          target="_blank"
          aria-label="Terms and conditions (opens in a new tab)"
        >
          terms & conditions
        </OakLink>{" "}
        and{" "}
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "privacy-policy",
          })}
          target="_blank"
          aria-label="Privacy policy (opens in a new tab)"
        >
          privacy policy
        </OakLink>
        .
      </OakP>
    </OakBox>
  );
};

export function AuthLayout({
  children,
  asideSlot,
  bannerSlot,
}: {
  children: React.ReactNode;
  asideSlot: React.ReactNode;
  bannerSlot?: React.ReactNode;
}) {
  const [clerkRendered, setClerkRendered] = useState(false);

  const checkForClerkElement = useCallback(() => {
    // Clerk docs say these classnames are stable
    const clerkSignUpElement = document.getElementsByClassName(
      "cl-rootBox cl-signUp-root",
    )[0];
    const clerkSignInElement = document.getElementsByClassName(
      "cl-rootBox cl-signIn-root",
    )[0];
    if (clerkSignUpElement || clerkSignInElement) {
      setClerkRendered(true);
    } else {
      setTimeout(() => checkForClerkElement(), 100);
    }
  }, []);

  useEffect(() => {
    checkForClerkElement();
  }, [checkForClerkElement]);

  return (
    <RegistrationLayout
      asideSlot={asideSlot}
      termsSlot={clerkRendered ? <TermsAndConditions /> : null}
      bannerSlot={clerkRendered ? bannerSlot : null}
    >
      {children}
    </RegistrationLayout>
  );
}
