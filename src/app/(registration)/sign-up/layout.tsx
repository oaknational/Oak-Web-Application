"use client";
import {
  OakFlex,
  OakBox,
  OakLink,
  OakP,
  OakInlineBanner,
} from "@oaknational/oak-components";
import { useState, useCallback, useEffect } from "react";

import { resolveOakHref } from "@/common-lib/urls";

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

const Layout = ({ children }: { children: React.ReactNode }) => {
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
    <OakFlex
      $flexDirection="column"
      $alignItems="center"
      $gap="space-between-m"
      $display={["flex", "block"]}
    >
      {clerkRendered && (
        <OakInlineBanner
          isOpen
          message={
            <>
              No <strong>pupil accounts</strong>, sorry.
            </>
          }
          $mt={["space-between-m", "space-between-none"]}
          $mb={["space-between-none", "space-between-m"]}
        />
      )}
      <OakBox
        $dropShadow={[null, "drop-shadow-standard"]}
        $borderRadius="border-radius-m2"
        $width={["auto", "max-content"]}
        $mb={["space-between-none", "space-between-m"]}
      >
        {children}
      </OakBox>
      {clerkRendered && <TermsAndConditions />}
    </OakFlex>
  );
};

export default Layout;
