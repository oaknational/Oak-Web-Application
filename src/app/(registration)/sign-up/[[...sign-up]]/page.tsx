/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";
import {
  OakBox,
  OakInlineBanner,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import { useState, useCallback, useEffect } from "react";

import { formAppearanceStyles } from "../../formAppearanceStyles";

import RegistrationAside from "@/components/TeacherComponents/RegistrationAside/ResgistrationAside";
import { RegistrationLayout } from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
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

function SignUpPage() {
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
      termsSlot={clerkRendered ? <TermsAndConditions /> : null}
      asideSlot={<RegistrationAside />}
      bannerSlot={
        clerkRendered ? (
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
        ) : null
      }
    >
      <SignUp
        appearance={formAppearanceStyles}
        unsafeMetadata={{ owa: { lastTrackedSignInAt: null } }}
      />
    </RegistrationLayout>
  );
}

export default SignUpPage;
