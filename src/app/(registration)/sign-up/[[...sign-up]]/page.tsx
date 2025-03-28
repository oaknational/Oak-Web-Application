/* istanbul ignore file */
"use client";

import { SignUp } from "@clerk/nextjs";
import { useState, useCallback, useEffect } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import {
  OakBox,
  OakFlex,
  OakInlineBanner,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import { formAppearanceStyles } from "../../formAppearanceStyles";

import RegistrationAside from "@/components/TeacherComponents/RegistrationAside/ResgistrationAside";
import RegistrationLayout from "@/components/TeacherComponents/RegistrationLayout/RegistrationLayout";
import { resolveOakHref } from "@/common-lib/urls";

const TermsAndConditions = ({
  newLayoutEnabled,
}: {
  newLayoutEnabled: boolean;
}) => {
  return (
    <OakBox $ph={newLayoutEnabled ? "inner-padding-xl3" : "inner-padding-none"}>
      <OakP
        $font="body-2"
        color="text-primary"
        $textAlign={newLayoutEnabled ? "left" : "center"}
      >
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

const Banner = ({ newLayoutEnabled }: { newLayoutEnabled: boolean }) => {
  return newLayoutEnabled ? (
    <OakInlineBanner
      isOpen
      $background="bg-decorative1-very-subdued"
      $ba="border-solid-none"
      message={
        <OakFlex $flexDirection="column">
          <OakP $font="body-3">
            <OakLink
              href={resolveOakHref({ page: "pupil-year-index" })}
              aria-label="Pupil year index"
            >
              Pupils can learn
            </OakLink>{" "}
            without signing up.
          </OakP>
          <OakP $font="body-3">Signups are for teachers and educators.</OakP>
        </OakFlex>
      }
    />
  ) : (
    <OakInlineBanner
      isOpen
      $width="100%"
      message={
        <>
          No <strong>pupil accounts</strong>, sorry.
        </>
      }
      $mt={["space-between-m", "space-between-none"]}
      $mb={["space-between-none", "space-between-m"]}
    />
  );
};

function SignUpPage() {
  const [clerkRendered, setClerkRendered] = useState(false);
  const featureFlagVariant = useFeatureFlagVariantKey("teacher-sign-up-page");
  const newLayoutEnabled = featureFlagVariant === "new-layout";

  const checkForClerkElement = useCallback(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

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
      termsSlot={
        clerkRendered ? (
          <TermsAndConditions newLayoutEnabled={newLayoutEnabled} />
        ) : null
      }
      asideSlot={<RegistrationAside useNew={newLayoutEnabled} />}
      useAlternateLayout={newLayoutEnabled}
      bannerSlot={
        clerkRendered ? <Banner newLayoutEnabled={newLayoutEnabled} /> : null
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
